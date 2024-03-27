const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const { CART_MESSAGES } = require('../helpers/msg')
const response = require('./Response')
const { cartValidation } = require('../helpers/cartValidation')
const isAuthorized = require('./isAuthorized')
const userAuthorization = new isAuthorized()
const { ROLE, AUTH_VALIDATION } = require('../helpers/const')

router
  .route('/add-to-cart')
  .post(userAuthorization.validateUser, async (req, res) => {
    const data = req.body
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const receivedUserId = req.userId
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.USER) {
        const addToCart = {
          userId: receivedUserId,
          count: data.count,
          productId: data.productId
        }
        const validation = cartValidation(addToCart)
        if (validation.valid) {
          const cart = new Cart(addToCart)
          const saveCart = await cart.save()

          if (saveCart && saveCart._id) {
            const getProduct = await Cart.findOne({
              userId: receivedUserId,
              status: { $ne: 'deleted' }
            }).populate('productId')
            const countCarts = await Cart.countDocuments({
              status: { $ne: 'deleted' },
              userId: getProduct.userId
            })
            const data = {
              getProduct,
              countCarts
            }
            const message = CART_MESSAGES.CREATED_SUCCESFULLY
            response.successResponse(res, message, data)
          } else {
            const message = CART_MESSAGES.UNABLE_TO_CREATE
            response.errorResponse(res, message)
          }
        } else {
          const message = CART_MESSAGES.FIELDS_MISSING
          const errors = validation.errors
          response.errorResponse(res, message, errors)
        }
      } else {
        const message = CART_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/list-user-cart/:id')
  .get(userAuthorization.validateMerchant, async (req, res) => {
    const { query } = req
    const { id } = req.params // getting userId
    const page = query.page ? parseInt(query.page) : 1
    const count = query.limit ? parseInt(query.limit) : 5
    const countCarts = await Cart.countDocuments({
      status: { $ne: 'deleted' }
    })
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    if (!isAuthTokenEmpty) {
      if (
        receivedUserRole === ROLE.MERCHANT ||
        receivedUserRole === ROLE.ADMIN
      ) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const listCart = await Cart.find({
            status: { $ne: 'deleted' },
            userId: id
          })
            .populate('productId')
            .skip((page - 1) * count)
            .limit(count)
            .sort({ created_date: -1 })
          if (listCart && listCart.length) {
            const message = CART_MESSAGES.CART_LIST
            const data = { listCart, totalCarts: countCarts }
            response.successResponse(res, message, data)
          } else {
            const message = CART_MESSAGES.FAILED_TO_CART_LIST
            response.errorResponse(res, message)
          }
        } else {
          const message = CART_MESSAGES.INVALID_ID
          response.errorResponse(res, message)
        }
      } else {
        const message = CART_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/list-cart')
  .get(userAuthorization.validateUser, async (req, res) => {
    const { query } = req
    const page = query.page ? parseInt(query.page) : 1
    const count = query.limit ? parseInt(query.limit) : 5
    const countCarts = await Cart.countDocuments({
      status: { $ne: 'deleted' }
    })
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const receivedUserId = req.userId
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.USER) {
        const listCart = await Cart.find({
          status: { $ne: 'deleted' },
          userId: receivedUserId
        })
          .populate('productId')
          .skip((page - 1) * count)
          .limit(count)
          .sort({ created_date: -1 })
        if (listCart && listCart.length) {
          const message = CART_MESSAGES.CART_LIST
          const data = { listCart, totalCarts: countCarts }
          response.successResponse(res, message, data)
        } else {
          const message = CART_MESSAGES.FAILED_TO_CART_LIST
          response.errorResponse(res, message)
        }
      } else {
        const message = CART_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/read-cart')
  .get(userAuthorization.validateUser, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const receivedUserId = req.userId
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.USER) {
        const getCart = await Cart.findOne({
          status: { $ne: 'deleted' },
          userId: receivedUserId
        }).populate('productId')
        if (getCart && getCart._id) {
          const message = CART_MESSAGES.CART_LIST
          const data = getCart
          response.successResponse(res, message, data)
        } else {
          const message = CART_MESSAGES.FAILED_TO_GET_CART
          response.errorResponse(res, message)
        }
      } else {
        const message = CART_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/update-cart/:id')
  .put(userAuthorization.validateUser, async (req, res) => {
    const { id } = req.params
    const data = req.body
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const receivedUserId = req.userId
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.USER) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const updateCart = await Cart.updateOne(
            {
              userId: receivedUserId,
              status: { $ne: 'deleted' },
              productId: id
            },
            { count: data.count }
          )
          if (updateCart && updateCart.nModified < updateCart.n) {
            const message = CART_MESSAGES.NO_UPDATE
            response.errorResponse(res, message)
          } else if (updateCart && updateCart.nModified >= 1) {
            const message = CART_MESSAGES.CART_UPDATED
            response.successResponse(res, message)
          } else {
            const message = CART_MESSAGES.FAILED_UPDATED
            response.errorResponse(res, message)
          }
        } else {
          const message = CART_MESSAGES.INVALID_ID
          response.errorResponse(res, message)
        }
      } else {
        const message = CART_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/delete-cart/:id')
  .delete(userAuthorization.validateUser, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const receivedUserId = req.userId
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.USER) {
        const { id } = req.params
        if (mongoose.Types.ObjectId.isValid(id)) {
          const deleteCart = await Cart.updateOne(
            {
              productId: id,
              userId: receivedUserId,
              status: { $ne: 'deleted' }
            },
            { status: 'deleted' }
          )
          if (deleteCart && deleteCart.nModified < deleteCart.n) {
            const message = CART_MESSAGES.ALREADY_DELETED
            response.errorResponse(res, message)
          } else if (deleteCart && deleteCart.nModified >= 1) {
            const message = CART_MESSAGES.CART_DELETED
            response.successResponse(res, message)
          } else {
            const message = CART_MESSAGES.FAILED_TO_DELETE
            response.errorResponse(res, message)
          }
        } else {
          const message = CART_MESSAGES.INVALID_ID
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
