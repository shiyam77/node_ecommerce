const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { User, UserSession } = require('../models/user')
const response = require('./Response')
const {
  userRegValidation,
  updateUserValidation
} = require('../helpers/userRegValidation')
const { USER_MESSAGES, AUTH_MESSAGES } = require('../helpers/msg')
const bcrypt = require('bcrypt')
const saltRounds = process.env.BCRYPT_SALT_ROUNDS
  ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
  : 8
const UIDGenerator = require('uid-generator')
const moment = require('moment')
const { STATUS } = require('../helpers/const')
const isAuthorized = require('./isAuthorized')
const { AUTH_VALIDATION, ROLE } = require('../helpers/const')
const { isMerchantSessionActive } = require('../helpers/utilities')

const userAuthorization = new isAuthorized()

router.route('/authenticate').post(async (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    const user = await User.findOne({ email: email, status: { $ne: 'deleted' } })
    if (user && user._id) {
      const valid = await bcrypt.compare(password, user.password)
      if (valid) {
        const expireTime = moment()
          .add(24, 'hours')
          .format()
        const authenticateUser = await UserSession.updateOne(
          { userId: user._id, status: { $ne: 'deleted' } },
          {
            role: ROLE.CUSTOMER,
            status: STATUS.ACTIVE,
            expireTime
          }
        )
        if (authenticateUser && authenticateUser.nModified >= 1) {
          const customerToken = await UserSession.findOne(
            {
              userId: user._id,
              status: { $ne: 'deleted' }
            }
          )
          const data = {
            authToken: customerToken.authToken,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              status: user.status
            }
          }
          const message = AUTH_MESSAGES.CREATED_SUCCESFULLY
          response.successResponse(res, message, data)
        } else {
          const message = AUTH_MESSAGES.UNABLE_TO_CREATE_AUTHENTICATION
          response.errorResponse(res, message)
        }
      } else {
        const message = AUTH_MESSAGES.ENTER_VALID_EMAIL_PASSWORD
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_MESSAGES.ENTER_VALID_EMAIL_PASSWORD
      response.errorResponse(res, message)
    }
  } else {
    const message = AUTH_MESSAGES.ENTER_VALID_EMAIL_PASSWORD
    response.errorResponse(res, message)
  }
})

router.route('/logout-customer').post(userAuthorization.validateUser, async (req, res) => {
  const receivedUserRole = req.role
  const isAuthTokenEmpty = req.isAuthTokenEmpty
  const receivedUserId = req.userId
  if (!isAuthTokenEmpty) {
    if (receivedUserRole === ROLE.CUSTOMER) {
      const expireTimeNow = moment().format()
      const logoutUser = await UserSession.updateOne(
        {
          userId: receivedUserId,
          status: { $ne: 'deleted' }
        },
        {
          status: STATUS.INACTIVE,
          expireTime: expireTimeNow
        }
      )
      if (logoutUser && logoutUser.nModified >= 1) {
        const message = USER_MESSAGES.LOGGED_OUT
        response.successResponse(res, message)
      } else {
        const message = USER_MESSAGES.UNABLE_TO_LOGOUT
        response.errorResponse(res, message)
      }
    } else {
      const message = USER_MESSAGES.ACCESS_DENIED
      response.errorResponse(res, message)
    }
  } else {
    const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
    response.errorResponse(res, message)
  }
})

router.route('/create-user').post(async (req, res) => {
  const data = req.body
  const validation = userRegValidation(data)
  if (validation.valid) {
    const user = await User.findOne({ email: data.email })
    if (user && user._id) {
      const message = USER_MESSAGES.ALREADY_PRESENT
      response.errorResponse(res, message)
    } else {
      const hash = await bcrypt.hash(data.password, saltRounds)
      if (hash) {
        const saveUser = new User({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: hash
        })
        const savedUser = await saveUser.save()
        if (savedUser && savedUser._id) {
          const authToken = await new UIDGenerator(256).generate()
          const expireTime = moment()
            .add(24, 'hours')
            .format()
          const session = new UserSession({
            userId: savedUser._id,
            authToken,
            status: STATUS.ACTIVE,
            expireTime,
            role: ROLE.CUSTOMER
          })
          const savedsession = await session.save()
          const data = {
            authToken: authToken,
            user: {
              firstName: savedUser.firstName,
              lastName: savedUser.lastName,
              email: savedUser.email,
              phoneNumber: savedUser.phoneNumber,
              status: savedUser.status
            }
          }
          if (savedsession && savedsession._id) {
            const message = USER_MESSAGES.CREATED_SUCCESFULLY
            response.successResponse(res, message, data)
          } else {
            const message = USER_MESSAGES.UNABLE_TO_CREATE
            response.errorResponse(res, message)
          }
        } else {
          const message = USER_MESSAGES.UNABLE_TO_CREATE
          response.errorResponse(res, message)
        }
      } else {
        const message = USER_MESSAGES.UNABLE_TO_CREATE
        response.errorResponse(res, message)
      }
    }
  } else {
    const message = USER_MESSAGES.FIELDS_MISSING
    const errors = validation.errors
    response.errorResponse(res, message, errors)
  }
})

router
  .route('/list-users')
  .get(userAuthorization.validateMerchant, isMerchantSessionActive, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const query = req.query
    const page = query && query.page ? parseInt(query.page) : 1
    const count = query && query.limit ? parseInt(query.limit) : 5
    const countUsers = await User.countDocuments({
      status: { $ne: 'deleted' }
    })
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.ADMIN || receivedUserRole === ROLE.MERCHANT) {
        const listUser = await User.find(
          { status: { $ne: 'deleted' } },
          'firstName lastName phoneNumber email role status'
        )
          .skip((page - 1) * count)
          .limit(count)
          .sort({ created_date: -1 })
        if (listUser && listUser.length) {
          const message = USER_MESSAGES.USER_LIST
          const data = {
            listUser,
            totalUsers: countUsers
          }
          response.successResponse(res, message, data)
        } else {
          const message = USER_MESSAGES.FAILED_TO_USER_LIST
          response.errorResponse(res, message)
        }
      } else {
        const message = USER_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/profile')
  .get(userAuthorization.validateUser, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserId = req.userId
    const receivedUserRole = req.role
    if (!isAuthTokenEmpty) {
      if (receivedUserRole === ROLE.CUSTOMER || receivedUserId) {
        const getUser = await User.findOne(
          { status: { $ne: 'deleted' }, _id: receivedUserId },
          'firstName lastName phoneNumber email role status'
        )
        if (getUser && getUser._id) {
          const message = USER_MESSAGES.USER_LIST
          const data = getUser
          response.successResponse(res, message, data)
        } else {
          const message = USER_MESSAGES.FAILED_TO_GET_USER
          response.errorResponse(res, message)
        }
      } else {
        const message = USER_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/read-user/:id')
  .get(userAuthorization.validateMerchant, async (req, res) => {
    const id = req.params.id
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    if (!isAuthTokenEmpty) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        if (
          receivedUserRole === ROLE.ADMIN ||
          receivedUserRole === ROLE.MERCHANT
        ) {
          const getUser = await User.findOne(
            { status: { $ne: 'deleted' }, _id: id },
            'firstName lastName phoneNumber email role status'
          )
          if (getUser && getUser._id) {
            const message = USER_MESSAGES.USER_LIST
            const data = getUser
            response.successResponse(res, message, data)
          } else {
            const message = USER_MESSAGES.FAILED_TO_GET_USER
            response.errorResponse(res, message)
          }
        } else {
          const message = USER_MESSAGES.ACCESS_DENIED
          response.errorResponse(res, message)
        }
      } else {
        const message = USER_MESSAGES.INVALID_ID
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/update-user')
  .put(userAuthorization.validateUser, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserId = req.userId
    const receivedUserRole = req.role
    const data = req.body
    const validation = updateUserValidation(data)
    if (!isAuthTokenEmpty) {
      if (receivedUserId && receivedUserRole === ROLE.USER) {
        if (validation.valid) {
          const updatedUser = await User.updateOne(
            { _id: receivedUserId, status: { $ne: 'deleted' } },
            data
          )
          if (updatedUser && updatedUser.nModified < updatedUser.n) {
            const message = USER_MESSAGES.NO_UPDATE
            response.errorResponse(res, message)
          } else if (updatedUser && updatedUser.nModified >= 1) {
            const message = USER_MESSAGES.USER_UPDATED
            response.successResponse(res, message)
          } else {
            const message = USER_MESSAGES.FAILED_UPDATED
            response.errorResponse(res, message)
          }
        } else {
          const message = USER_MESSAGES.FIELDS_MISSING
          const errors = validation.errors
          response.errorResponse(res, message, errors)
        }
      } else {
        const message = USER_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/delete-user/:id')
  .delete(userAuthorization.validateUser, async (req, res) => {
    const id = req.params.id
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const receivedUserId = req.userId
    if (mongoose.Types.ObjectId.isValid(id)) {
      if (!isAuthTokenEmpty) {
        if (receivedUserId == id || receivedUserRole === ROLE.ADMIN) {
          const deleteUser = await User.updateOne(
            { _id: id, status: { $ne: 'deleted' } },
            { status: 'deleted' }
          )
          if (deleteUser && deleteUser.nModified < deleteUser.n) {
            const message = USER_MESSAGES.ALREADY_DELETED
            response.errorResponse(res, message)
          }
          if (deleteUser && deleteUser.nModified >= 1) {
            const message = USER_MESSAGES.USER_DELETED
            response.successResponse(res, message)
          } else {
            const message = USER_MESSAGES.FAILED_TO_DELETE
            response.errorResponse(res, message)
          }
        } else {
          const message = USER_MESSAGES.ACCESS_DENIED
          response.errorResponse(res, message)
        }
      } else {
        const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
        response.errorResponse(res, message)
      }
    } else {
      const message = USER_MESSAGES.INVALID_ID
      response.errorResponse(res, message)
    }
  })

module.exports = router
