const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Brand = require('../models/brand')
const { brandValidation } = require('../helpers/brandvalidation')
const { BRAND_MESSAGES } = require('../helpers/msg')
const response = require('./Response')
const { checksMerchant, isMerchantSessionActive, checksAdmin } = require('../helpers/utilities')
const isAuthorized = require('./isAuthorized')

const userAuthorization = new isAuthorized()

router.route('/create-brand').post(
  userAuthorization.validateMerchant,
  isMerchantSessionActive,
  async (req, res) => {
    const data = req.body
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const isMerchantValid = checksMerchant(isAuthTokenEmpty, receivedUserRole)
    const validation = brandValidation(data)
    if (isMerchantValid.valid) {
      if (validation.valid) {
        const brand = await Brand.findOne({ name: req.body.name })
        if (brand && brand._id) {
          const message = BRAND_MESSAGES.ALREADY_PRESENT
          response.errorResponse(res, message)
        } else {
          const newBrand = await new Brand({
            name: data.name,
            type: data.type,
            shortDescription: data.shortDescription
          })
          const saveBrand = await newBrand.save()
          if (saveBrand && saveBrand._id) {
            const data = {
              name: saveBrand.name,
              type: saveBrand.type,
              shortDescription: saveBrand.shortDescription,
              status: saveBrand.status
            }
            const message = BRAND_MESSAGES.CREATED_SUCCESFULLY
            response.successResponse(res, message, data)
          } else {
            const message = BRAND_MESSAGES.UNABLE_TO_CREATE_BRAND
            response.errorResponse(res, message)
          }
        }
      } else {
        const message = BRAND_MESSAGES.FIELDS_MISSING
        const errors = validation.errors
        response.errorResponse(res, message, errors)
      }
    } else {
      const message = isMerchantValid.message
      response.errorResponse(res, message)
    }
  })

router.route('/list-brand').get(async (req, res) => {
  const query = req.query
  const page = query && query.page ? parseInt(query.page) : 1
  const count = query && query.limit ? parseInt(query.limit) : 5
  const countBrand = await Brand.countDocuments({
    status: { $ne: 'deleted' }
  })
  const listBrand = await Brand.find(
    { status: { $ne: 'deleted' } },
    'name type shortDescription status'
  )
    .skip((page - 1) * count)
    .limit(count)
    .sort({ created_date: -1 })
  if (listBrand && listBrand.length) {
    const message = BRAND_MESSAGES.BRAND_LIST
    const data = { listBrand, totalBrand: countBrand }
    response.successResponse(res, message, data)
  } else {
    const message = BRAND_MESSAGES.FAILED_TO_BRAND_LIST
    response.errorResponse(res, message)
  }
})

router.route('/read-brand/:id').get(
  async (req, res) => {
  const id = req.params.id
  if (mongoose.Types.ObjectId.isValid(id)) {
    const getBrand = await Brand.findOne(
      {
        _id: id,
        status: { $ne: 'deleted' }
      },
      'name type shortDescription status'
    )
    if (getBrand && getBrand._id) {
      const message = BRAND_MESSAGES.BRAND_LIST
      const data = getBrand
      response.successResponse(res, message, data)
    } else {
      const message = BRAND_MESSAGES.FAILED_TO_GET_BRAND
      response.errorResponse(res, message)
    }
  } else {
    const message = BRAND_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

router.route('/update-brand/:id').put(
  userAuthorization.validateMerchant,
  isMerchantSessionActive,
  async (req, res) => {
  const id = req.params.id
  const data = req.body
  const isAuthTokenEmpty = req.isAuthTokenEmpty
  const receivedUserRole = req.role
  const isMerchantValid = checksMerchant(isAuthTokenEmpty, receivedUserRole)
  if (mongoose.Types.ObjectId.isValid(id)) {

    if (isMerchantValid.valid) {
      const updatedBrand = await Brand.updateOne(
        {
          _id: id,
          status: { $ne: 'deleted' }
        },
        data
      )
      if (updatedBrand && updatedBrand.nModified < updatedBrand.n) {
        const message = BRAND_MESSAGES.NO_UPDATE
        response.errorResponse(res, message)
      } else if (updatedBrand && updatedBrand.nModified >= 1) {
        const message = BRAND_MESSAGES.BRAND_UPDATED
        response.successResponse(res, message)
      } else {
        const message = BRAND_MESSAGES.FAILED_UPDATED
        response.errorResponse(res, message)
      }
    } else {
      const message = isMerchantValid.message
      response.errorResponse(res, message)
    }
  } else {
    const message = BRAND_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

router.route('/delete-brand/:id').delete(
  userAuthorization.validateMerchant,
  isMerchantSessionActive,
  async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const isMerchantValid = checksMerchant(isAuthTokenEmpty, receivedUserRole)
  const id = req.params.id
  if (mongoose.Types.ObjectId.isValid(id)) {
    if (isMerchantValid.valid) {
      const deletedBrand = await Brand.updateOne(
        {
          _id: id,
          status: { $ne: 'deleted' }
        },
        { status: 'deleted' }
      )
      if (deletedBrand && deletedBrand.nModified < deletedBrand.n) {
        const message = BRAND_MESSAGES.ALREADY_DELETED
        response.errorResponse(res, message)
      }
      if (deletedBrand && deletedBrand.nModified >= 1) {
        const message = BRAND_MESSAGES.BRAND_DELETED
        response.successResponse(res, message)
      } else {
        const message = BRAND_MESSAGES.FAILED_TO_DELETE
        response.errorResponse(res, message)
      }
  } else {
    const message = isMerchantValid.message
    response.errorResponse(res, message)
  }
  } else {
    const message = BRAND_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

module.exports = router
