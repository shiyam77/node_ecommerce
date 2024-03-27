const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Products = require('../models/product')
const { PRODUCT_MESSAGES } = require('../helpers/msg')
const response = require('./Response')
const {
  productValidation,
  updateProductValidation
} = require('../helpers/productValidation')
var multer = require('multer')
var upload = multer({ dest: 'uploads/images/' })
const fs = require('fs')
const isAuthorized = require('./isAuthorized')
const userAuthorization = new isAuthorized()
const { ROLE, AUTH_VALIDATION } = require('../helpers/const')

router.route('/image/:id').get((req, res) => {
  const filename = req.params.id
  fs.readFile(`uploads/images/${filename}`, (err, data) => {
    if (!err) {
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.write(data)
      res.end()
    } else {
      res.status(404).send('invalid Image Name')
    }
  })
})

router
  .route('/upload-image')
  .post(
    userAuthorization.validateMerchant,
    upload.single('image'),
    async (req, res) => {
      const { file } = req
      const isAuthTokenEmpty = req.isAuthTokenEmpty
      const receivedUserRole = req.role
      if (!isAuthTokenEmpty) {
        if (
          receivedUserRole === ROLE.MERCHANT ||
          receivedUserRole === ROLE.ADMIN
        ) {
          if (file) {
            const data = {
              fileName: file.filename,
              originalname: file.originalname,
              status: file.status
            }
            const message = PRODUCT_MESSAGES.UPLOADED_SUCCESSFULLY
            response.successResponse(res, message, data)
          } else {
            const message = PRODUCT_MESSAGES.FAILED_TO_UPLOAD
            response.errorResponse(res, message)
          }
        } else {
          const message = PRODUCT_MESSAGES.ACCESS_DENIED
          response.errorResponse(res, message)
        }
      } else {
        const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
        response.errorResponse(res, message)
      }
    }
  )

router
  .route('/create-product')
  .post(userAuthorization.validateMerchant, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const data = req.body
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.MERCHANT) {
        const validation = productValidation(data)
        if (validation.valid) {
          const product = await Products.findOne({
            productName: req.body.productName
          })
          if (product && product._id) {
            const message = PRODUCT_MESSAGES.ALREADY_PRESENT
            response.errorResponse(res, message)
          } else {
            const product = new Products({
              productName: data.productName,
              sku: data.sku,
              actualPrice: data.actualPrice,
              description: data.description,
              color: data.color,
              images: data.images,
              soldCount: data.soldCount,
              rating: data.rating,
              inStockCount: data.inStockCount,
              category: data.category,
              tags: data.tags,
              keywords: data.keywords
            })
            const saveProduct = await product.save()
            if (saveProduct && saveProduct._id) {
              const message = PRODUCT_MESSAGES.CREATED_SUCCESFULLY
              response.successResponse(res, message)
            } else {
              const message = PRODUCT_MESSAGES.UNABLE_TO_CREATE
              response.errorResponse(res, message)
            }
          }
        } else {
          const message = PRODUCT_MESSAGES.FIELDS_MISSING
          const errors = validation.errors
          response.errorResponse(res, message, errors)
        }
      } else {
        const message = PRODUCT_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router.route('/list-product').get(async (req, res) => {
  const query = req.query
  const page = query && query.page ? parseInt(query.page) : 1
  const count = query && query.limit ? parseInt(query.limit) : 3
  const countProducts = await Products.countDocuments({
    status: { $ne: 'deleted' }
  })
  const listProduct = await Products.find(
    {
      status: { $ne: 'deleted' }
    },
    'productName productSlug sku  actualPrice description color images soldCount rating inStockCount category tags keywords status'
  )
    .skip((page - 1) * count)
    .limit(count)
    .sort({ created_date: -1 })
  if (listProduct && listProduct.length) {
    const message = PRODUCT_MESSAGES.PRODUCT_LIST
    const data = { listProduct, totalProducts: countProducts }
    response.successResponse(res, message, data)
  } else {
    const message = PRODUCT_MESSAGES.FAILED_TO_PRODUCT_LIST
    response.errorResponse(res, message)
  }
})

router.route('/read-product/:id').get(async (req, res) => {
  const id = req.params.id
  if (mongoose.Types.ObjectId.isValid(id)) {
    const getProduct = await Products.findOne(
      { _id: id },
      'productName productSlug sku  actualPrice description color images soldCount rating inStockCount category tags keywords status'
    )
    if (getProduct && getProduct._id) {
      const message = PRODUCT_MESSAGES.PRODUCT_LIST
      const data = getProduct
      response.successResponse(res, message, data)
    } else {
      const message = PRODUCT_MESSAGES.FAILED_TO_GET_PRODUCT
      response.errorResponse(res, message)
    }
  } else {
    const message = PRODUCT_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

router
  .route('/update-product/:id')
  .put(userAuthorization.validateMerchant, async (req, res) => {
    const id = req.params.id
    const data = req.body
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    if (!isAuthTokenEmpty) {
      if (
        receivedUserRole === ROLE.MERCHANT ||
        receivedUserRole === ROLE.ADMIN
      ) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const isAlreadyPresent = await Products.findOne({
            productName: data.productName
          })
          if (!isAlreadyPresent) {
            const validation = updateProductValidation(data)
            if (validation.valid) {
              const updatedProduct = await Products.updateOne(
                {
                  _id: id,
                  status: { $ne: 'deleted' }
                },
                data
              )
              if (
                updatedProduct &&
                updatedProduct.nModified < updatedProduct.n
              ) {
                const message = PRODUCT_MESSAGES.NO_UPDATE
                response.errorResponse(res, message)
              } else if (updatedProduct && updatedProduct.nModified >= 1) {
                const message = PRODUCT_MESSAGES.PRODUCT_UPDATED
                response.successResponse(res, message)
              } else {
                const message = PRODUCT_MESSAGES.FAILED_UPDATED
                response.errorResponse(res, message)
              }
            } else {
              const message = PRODUCT_MESSAGES.FIELDS_MISSING
              const errors = validation.errors
              response.errorResponse(res, message, errors)
            }
          } else {
            const message = PRODUCT_MESSAGES.ALREADY_PRESENT
            response.errorResponse(res, message)
          }
        } else {
          const message = PRODUCT_MESSAGES.INVALID_ID
          response.errorResponse(res, message)
        }
      } else {
        const message = PRODUCT_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/approve-product/:id')
  .put(userAuthorization.validateMerchant, async (req, res) => {
    const id = req.params.id
    const data = req.body
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.ADMIN) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          if (data.status) {
            const updatedProduct = await Products.updateOne(
              {
                _id: id,
                status: { $ne: 'deleted' }
              },
              data
            )
            if (updatedProduct && updatedProduct.nModified < updatedProduct.n) {
              const message = PRODUCT_MESSAGES.NO_UPDATE
              response.errorResponse(res, message)
            } else if (updatedProduct && updatedProduct.nModified >= 1) {
              const message = PRODUCT_MESSAGES.PRODUCT_UPDATED
              response.successResponse(res, message)
            } else {
              const message = PRODUCT_MESSAGES.FAILED_UPDATED
              response.errorResponse(res, message)
            }
          } else {
            const message = PRODUCT_MESSAGES.ENTER_STATUS
            response.errorResponse(res, message)
          }
        } else {
          const message = PRODUCT_MESSAGES.INVALID_ID
          response.errorResponse(res, message)
        }
      } else {
        const message = PRODUCT_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/delete-product/:id')
  .delete(userAuthorization.validateMerchant, async (req, res) => {
    const id = req.params.id
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    if (!isAuthTokenEmpty) {
      if (
        receivedUserRole === ROLE.MERCHANT ||
        receivedUserRole === ROLE.ADMIN
      ) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const deletedProduct = await Products.updateOne(
            {
              _id: id,
              status: { $ne: 'deleted' }
            },
            { status: 'deleted' }
          )
          if (deletedProduct && deletedProduct.nModified < deletedProduct.n) {
            const message = PRODUCT_MESSAGES.ALREADY_DELETED
            response.errorResponse(res, message)
          }
          if (deletedProduct && deletedProduct.nModified >= 1) {
            const message = PRODUCT_MESSAGES.PRODUCT_DELETED
            response.successResponse(res, message)
          } else {
            const message = PRODUCT_MESSAGES.FAILED_TO_DELETE
            response.errorResponse(res, message)
          }
        } else {
          const message = PRODUCT_MESSAGES.INVALID_ID
          response.errorResponse(res, message)
        }
      } else {
        const message = PRODUCT_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

module.exports = router
