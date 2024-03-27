const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Orders = require('../models/orders')
const { ORDERS_MESSAGES } = require('../helpers/msg')
const response = require('./Response')
const { orderValidation } = require('../helpers/orderValidation')
const isAuthorized = require('./isAuthorized')

const userAuthorization = new isAuthorized()

router
  .route('/create-order')
  .post(userAuthorization.validateUser, async (req, res) => {
    const data = req.body
    const validation = orderValidation(data)
    if (validation.valid) {
      const presentOrder = await Orders.findOne({ orderName: data.orderName })
      if (presentOrder && presentOrder._id) {
        const message = ORDERS_MESSAGES.ALREADY_PRESENT
        response.errorResponse(res, message)
      } else {
        const order = new Orders({
          orderName: data.orderName,
          orderSlug: data.orderSlug,
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
        const saveOrder = await order.save()
        if (saveOrder && saveOrder._id) {
          const message = ORDERS_MESSAGES.CREATED_SUCCESFULLY
          response.successResponse(res, message)
        } else {
          const message = ORDERS_MESSAGES.UNABLE_TO_CREATE
          response.errorResponse(res, message)
        }
      }
    } else {
      const message = ORDERS_MESSAGES.FIELDS_MISSING
      const errors = validation.errors
      response.errorResponse(res, message, errors)
    }
  })

router.route('/list-orders').get(async (req, res) => {
  const { query } = req
  const page = query && query.page ? parseInt(query.page) : 1
  const count = query && query.limit ? parseInt(query.limit) : 5
  const countOrders = await Orders.countDocuments({
    status: { $ne: 'deleted' }
  })
  const listOrders = await Orders.find(
    { status: { $ne: 'deleted' } },
    'orderName orderSlug sku  actualPrice description color images soldCount rating inStockCount category tags keywords status'
  )
    .skip((page - 1) * count)
    .limit(count)
    .sort({ created_date: -1 })
  if (listOrders && listOrders.length) {
    const data = {
      listOrders,
      totalOrders: countOrders
    }
    const message = ORDERS_MESSAGES.ORDERS_LIST
    response.successResponse(res, message, data)
  } else {
    const message = ORDERS_MESSAGES.FAILED_TO_ORDERS_LIST
    response.errorResponse(res, message)
  }
})

router.route('/read-order/:id').get(async (req, res) => {
  const { id } = req.params
  if (mongoose.Types.ObjectId.isValid(id)) {
    const getOrder = await Orders.findOne(
      { status: { $ne: 'deleted' }, _id: id },
      'orderName orderSlug sku  actualPrice description color images soldCount rating inStockCount category tags keywords status'
    )
    if (getOrder && getOrder._id) {
      const message = ORDERS_MESSAGES.ORDERS_LIST
      const data = getOrder
      response.successResponse(res, message, data)
    } else {
      const message = ORDERS_MESSAGES.FAILED_TO_GET_ORDER
      response.errorResponse(res, message)
    }
  } else {
    const message = ORDERS_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

router.route('/update-order/:id').put(async (req, res) => {
  const { id } = req.params
  const data = req.body
  if (mongoose.Types.ObjectId.isValid(id)) {
    const updateOrder = await Orders.updateOne(
      { _id: id, status: { $ne: 'deleted' } },
      data
    )
    if (updateOrder && updateOrder.nModified < updateOrder.n) {
      const message = ORDERS_MESSAGES.NO_UPDATE
      response.errorResponse(res, message)
    } else if (updateOrder && updateOrder.nModified >= 1) {
      const message = ORDERS_MESSAGES.ORDERS_UPDATED
      response.successResponse(res, message)
    } else {
      const message = ORDERS_MESSAGES.FAILED_UPDATED
      response.errorResponse(res, message)
    }
  } else {
    const message = ORDERS_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

router.route('/delete-order/:id').delete(async (req, res) => {
  const { id } = req.params
  if (mongoose.Types.ObjectId.isValid(id)) {
    const deleteOrder = await Orders.updateOne(
      { _id: id, status: { $ne: 'deleted' } },
      { status: 'deleted' }
    )
    if (deleteOrder && deleteOrder.nModified < deleteOrder.n) {
      const message = ORDERS_MESSAGES.ALREADY_DELETED
      response.errorResponse(res, message)
    }
    if (deleteOrder && deleteOrder.nModified >= 1) {
      const message = ORDERS_MESSAGES.ORDERS_DELETED
      response.successResponse(res, message)
    } else {
      const message = ORDERS_MESSAGES.FAILED_TO_DELETE
      response.errorResponse(res, message)
    }
  } else {
    const message = ORDERS_MESSAGES.INVALID_ID
    response.errorResponse(res, message)
  }
})

module.exports = router
