const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const { categoryValidation } = require('../helpers/categoryValidation')
const mongoose = require('mongoose')
const { CATEGORY_MESSAGES } = require('../helpers/msg')
const { checksMerchant, isMerchantSessionActive, checksAdmin } = require('../helpers/utilities')
const response = require('./Response')
const isAuthorized = require('./isAuthorized')

const userAuthorization = new isAuthorized()

router.route('/create-category').post(
  userAuthorization.validateMerchant,
  isMerchantSessionActive,
  async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const isMerchantValid = checksMerchant(isAuthTokenEmpty, receivedUserRole)
    if (isMerchantValid.valid) {
      const validation = categoryValidation(req.body)
      if (validation.valid) {
        const category = await Category.findOne({ categoryName: req.body.categoryName })
        if (category && category._id) {
          const message = CATEGORY_MESSAGES.ALREADY_PRESENT
          response.errorResponse(res, message)
        } else {
          const newCategory = new Category({
            categoryName: req.body.categoryName,
            imageUrl: req.body.imageUrl,
            shortDescription: req.body.shortDescription,
            subcategory: req.body.subcategory
          })
          const saveCategory = await newCategory.save()
          if (saveCategory && saveCategory._id) {
            const message = CATEGORY_MESSAGES.CREATED_SUCCESFULLY
            response.successResponse(res, message)
          } else {
            const message = CATEGORY_MESSAGES.UNABLE_TO_CREATE_CATEGORY
            response.errorResponse(res, message)
          }
        }
      } else {
        const message = CATEGORY_MESSAGES.FIELDS_MISSING
        const errors = validation.error
        response.errorResponse(res, message, errors)
      }
    } else {
      const message = isMerchantValid.message
      response.errorResponse(res, message)
    }
  })

router.route('/list-category').get(
  async (req, res) => {
    const { query } = req
    const page = query && query.page ? parseInt(query.page) : 1
    const count = query && query.count ? parseInt(query.count) : 1
    const countCategory = await Category.countDocuments({
      status: { $ne: 'deleted' }
    })
    const category = await Category.find(
      { status: { $ne: 'deleted' } },
      'categoryName imageUrl shortDescription subcategory status'
    )
      .limit(count)
      .skip((page - 1) * count)
      .sort({ created_date: -1 })
    if (category && category.length) {
      const message = CATEGORY_MESSAGES.CATEGORY_LIST
      const data = { category, TtotalCategory: countCategory }
      response.successResponse(res, message, data)
    } else {
      const message = CATEGORY_MESSAGES.FAILED_TO_CATEGORY_LIST
      response.errorResponse(res, message)
    }
  })

router.route('/read-category/:id').get(async (req, res) => {
  const id = req.params.id
  if (mongoose.Types.ObjectId.isValid(id)) {
    const category = await Category.findOne(
      { _id: id, status: { $ne: 'deleted' } },
      'categoryName imageUrl shortDescription subcategory status'
    )
    if (category && category._id) {
      const message = CATEGORY_MESSAGES.CATEGORY_LIST
      const data = category
      response.successResponse(res, message, data)
    } else {
      const message = CATEGORY_MESSAGES.FAILED_TO_GET_CATEGORY
      response.errorResponse(res, message)
    }
  } else {
    const message = CATEGORY_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

router.route('/update-category/:id').put(
  userAuthorization.validateMerchant,
  isMerchantSessionActive,
  async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const isAdminValid = checksAdmin(isAuthTokenEmpty, receivedUserRole)
    const id = req.params.id
    const data = req.body
    if (isAdminValid.valid) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updateCategory = await Category.updateOne(
          { _id: id, status: { $ne: 'deleted' } },
          data
        )
        if (updateCategory && updateCategory.nModified < updateCategory.n) {
          const message = CATEGORY_MESSAGES.NO_UPDATE
          response.errorResponse(res, message)
        } else if (updateCategory && updateCategory.nModified >= 1) {
          const message = CATEGORY_MESSAGES.CATEGORY_UPDATED
          response.successResponse(res, message)
        } else {
          const message = CATEGORY_MESSAGES.FAILED_UPDATED
          response.errorResponse(res, message)
        }
      } else {
        const message = CATEGORY_MESSAGES.INVALID_ID
        response.errorResponse(res, message)
      }
    } else {
      const message = isAdminValid.message
      response.errorResponse(res, message)
    }
  })

router.route('/delete-category/:id').delete(
  userAuthorization.validateMerchant,
  isMerchantSessionActive,
  async (req, res) => {
    const id = req.params.id
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const isAdminValid = checksAdmin(isAuthTokenEmpty, receivedUserRole)
    if (isAdminValid.valid) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deletedCategory = await Category.updateOne(
          { _id: id, status: { $ne: 'deleted' } },
          { status: 'deleted' }
        )
        if (deletedCategory && deletedCategory.nModified === 0 && deletedCategory.n === 0) {
          const message = CATEGORY_MESSAGES.ALREADY_DELETED
          response.errorResponse(res, message)
        } else if (deletedCategory && deletedCategory.nModified >= 1) {
          const message = CATEGORY_MESSAGES.CATEGORY_DELETED
          response.successResponse(res, message)
        } else {
          const message = CATEGORY_MESSAGES.FAILED_TO_DELETE
          response.errorResponse(res, message)
        }
      } else {
        const message = CATEGORY_MESSAGES.INVALID_ID
        response.errorResponse(res, message)
      }
    } else {
      const message = isAdminValid.message
      response.errorResponse(res, message)
    }
  })

module.exports = router
