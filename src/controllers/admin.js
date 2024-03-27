const express = require('express')
const router = express.Router()
const {
  adminValidation,
  adminUpdateValidation,
  UpdateStatusValidation,
  deleteValidation
} = require('../helpers/adminvalidation')
const Admin = require('../models/Admin')
const { Merchant, MerchantSession } = require('../models/merchant')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UIDGenerator = require('uid-generator')
const response = require('./Response')
const moment = require('moment')
const saltRounds = process.env.BCRYPT_SALT_ROUNDS
  ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
  : 8
const { STATUS, ROLE, AUTH_VALIDATION } = require('../helpers/const')
const { ADMIN_MESSAGES, AUTH_MESSAGES } = require('../helpers/msg')
const isAuthorized = require('./isAuthorized')

const userAuthorization = new isAuthorized()

router.route('/authenticate').post(async (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    const user = await Admin.findOne({
      email: email,
      status: { $ne: 'deleted' }
    })
    if (user && user._id) {
      const valid = await bcrypt.compare(password, user.password)
      if (valid) {
        const expireTime = moment()
          .add(24, 'hours')
          .format()
        const loginAdmin = await MerchantSession.updateOne(
          {
            userId: user._id,
            status: { $ne: 'deleted' }
          },
          {
            role: ROLE.ADMIN,
            status: STATUS.ACTIVE,
            expireTime
          })
        if (loginAdmin && loginAdmin.nModified >= 1) {
          const adminToken = await MerchantSession.findOne(
            {
              userId: user._id,
              status: { $ne: 'deleted' }
            }
          )
          const message = AUTH_MESSAGES.AUTHENTICATION_SUCCESS
          const data = {
            authToken: adminToken.authToken,
            admin: {
              email: user.email,
              status: user.status,
              role: user.role
            }
          }
          response.successResponse(res, message, data)
        } else {
          const message = AUTH_MESSAGES.UNABLE_TO_CREATE_SESSION
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

router.route('/logout-admin').post(userAuthorization.validateMerchant, async (req, res) => {
  const receivedUserRole = req.role
  const isAuthTokenEmpty = req.isAuthTokenEmpty
  const receivedUserId = req.userId
  if (!isAuthTokenEmpty) {
    if (receivedUserRole === ROLE.ADMIN) {
      const expireTimeNow = moment().format()
      const logoutUser = await MerchantSession.updateOne(
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
        const message = ADMIN_MESSAGES.LOGGED_OUT
        response.successResponse(res, message)
      } else {
        const message = ADMIN_MESSAGES.UNABLE_TO_LOGOUT
        response.errorResponse(res, message)
      }
    } else {
      const message = ADMIN_MESSAGES.ACCESS_DENIED
      response.errorResponse(res, message)
    }
  } else {
    const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
    response.errorResponse(res, message)
  }
})

router.route('/create-merchant').post(async (req, res) => {
  const validation = adminValidation(req.body)
  if (validation.valid) {
    const merchant = await Merchant.findOne({
      email: req.body.email,
      status: { $ne: 'deleted' }
    })
    if (merchant && merchant._id) {
      const message = ADMIN_MESSAGES.USER_ALREADY_PRESENT
      response.errorResponse(res, message)
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds)
      if (hash) {
        const newMerchant = new Merchant({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          role: req.body.role,
          password: hash
        })
        const createdAdmin = await newMerchant.save()
        if (createdAdmin && createdAdmin._id) {
          const authToken = await new UIDGenerator(256).generate()
          const expireTime = moment()
            .add(24, 'hours')
            .format()
          const session = new MerchantSession({
            userId: createdAdmin._id,
            authToken,
            status: STATUS.ACTIVE,
            role: ROLE.MERCHANT,
            expireTime
          })
          const sessionSaved = await session.save()
          if (sessionSaved && sessionSaved._id) {
            const data = {
              authToken: authToken,
              merchant: {
                firstname: createdAdmin.firstname,
                lastname: createdAdmin.lastname,
                phoneNumber: createdAdmin.phoneNumber,
                email: createdAdmin.email,
                role: createdAdmin.role,
                status: createdAdmin.status
              }
            }
            const message = ADMIN_MESSAGES.MERCHANT_CREATED_SUCCESSFULLY
            response.successResponse(res, message, data)
          } else {
            const message = AUTH_MESSAGES.UNABLE_TO_CREATE_SESSION
            response.errorResponse(res, message)
          }
        } else {
          const message = ADMIN_MESSAGES.UNABLE_TO_CREATED_A_MERCHANT
          response.errorResponse(res, message)
        }
      } else {
        const message = ADMIN_MESSAGES.UNABLE_TO_CREATE_PASSWORD
        response.errorResponse(res, message)
      }
    }
  } else {
    const message = ADMIN_MESSAGES.FIELDS_MISSING
    const errors = validation.errors
    response.errorResponse(res, message, errors)
  }
})

router.route('/authenticate-merchant').post(async (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    const merchant = await Merchant.findOne({
      email: req.body.email,
      status: { $ne: 'deleted' }
    })
    if (merchant && merchant.password) {
      const valid = await bcrypt.compare(password, merchant.password)
      if (valid) {
        const expireTime = moment()
          .add(24, 'hours')
          .format()
        const updatedSession = await MerchantSession.updateOne(
          {
            userId: merchant._id,
            status: { $ne: 'deleted' }
          },
          {
            status: STATUS.ACTIVE,
            expireTime: expireTime
          }
        )
        if (updatedSession && updatedSession.nModified >= 1) {
          const merchantToken = await MerchantSession.findOne(
            {
              userId: merchant._id,
              status: { $ne: 'deleted' }
            }
          )
          const message = AUTH_MESSAGES.AUTHENTICATION_SUCCESS
          const data = {
            authToken: merchantToken.authToken,
            merchant: {
              firstname: merchant.firstname,
              lastname: merchant.lastname,
              email: merchant.email,
              status: merchant.status,
              role: merchant.role
            }
          }
          response.successResponse(res, message, data)
        } else {
          const message = AUTH_MESSAGES.UNABLE_TO_CREATE_SESSION
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

router.route('/logout-merchant').post(userAuthorization.validateMerchant, async (req, res) => {
  const receivedUserRole = req.role
  const isAuthTokenEmpty = req.isAuthTokenEmpty
  const receivedUserId = req.userId
  if (!isAuthTokenEmpty) {
    if (receivedUserRole === ROLE.MERCHANT) {
      const expireTimeNow = moment().format()
      const logoutUser = await MerchantSession.updateOne(
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
        const message = ADMIN_MESSAGES.LOGGED_OUT
        response.successResponse(res, message)
      } else {
        const message = ADMIN_MESSAGES.UNABLE_TO_LOGOUT
        response.errorResponse(res, message)
      }
    } else {
      const message = ADMIN_MESSAGES.ACCESS_DENIED
      response.errorResponse(res, message)
    }
  } else {
    const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
    response.errorResponse(res, message)
  }
})

router
  .route('/list-merchants')
  .get(userAuthorization.validateMerchant, async (req, res) => {
    const query = req.query
    const page = query && query.page ? parseInt(query.page) : 1
    const count = query && query.limit ? parseInt(query.limit) : 5
    const countMerchant = await Merchant.countDocuments({
      status: { $ne: 'deleted' }
    })
    const receivedUserRole = req.role
    if (receivedUserRole === ROLE.ADMIN) {
      const merchant = await Merchant.find(
        { status: { $ne: 'deleted' } },
        'firstname lastname email phoneNumber status role'
      )
        .skip((page - 1) * count)
        .limit(count)
        .sort({ created_date: -1 })

      if (merchant && merchant.length) {
        const message = ADMIN_MESSAGES.MERCHANT_LIST
        const data = { merchant, totalMerchant: countMerchant }
        response.successResponse(res, message, data)
      } else {
        const message = ADMIN_MESSAGES.FAILED_TO_USER_LIST
        response.errorResponse(res, message)
      }
    } else {
      const message = ADMIN_MESSAGES.ACCESS_DENIED
      response.errorResponse(res, message)
    }
  })

router
  .route('/read-merchant/:id')
  .get(userAuthorization.validateMerchant, async (req, res) => {
    const id = req.params.id
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserId = req.userId
    const receivedUserRole = req.role
    if (mongoose.Types.ObjectId.isValid(id)) {
      if (!isAuthTokenEmpty) {
        if (receivedUserRole === ROLE.ADMIN || id == receivedUserId) {
          const users = await Merchant.findOne(
            { _id: id, status: { $ne: 'deleted' } },
            'firstname lastname email phoneNumber status role'
          )
          if (users && users._id) {
            const message = ADMIN_MESSAGES.MERCHANT_LIST
            const data = users
            response.successResponse(res, message, data)
          } else {
            const message = ADMIN_MESSAGES.FAILED_TO_USER
            response.errorResponse(res, message)
          }
        } else {
          const message = ADMIN_MESSAGES.ACCESS_DENIED
          response.errorResponse(res, message)
        }
      } else {
        const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
        response.errorResponse(res, message)
      }
    } else {
      const message = ADMIN_MESSAGES.INVALID_ID
      response.errorResponse(res, message)
    }
  })

router
  .route('/update-merchant')
  .put(userAuthorization.validateMerchant, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const data = req.body
    const receivedUserId = req.userId
    if (!isAuthTokenEmpty) {
      const userDetails = await Merchant.findOne(
        {
          _id: receivedUserId,
          status: { $ne: 'deleted' }
        },
        'firstname lastname email phoneNumber  status role'
      )
      if (
        (userDetails && userDetails.role === ROLE.ADMIN) ||
        (userDetails && userDetails._id == receivedUserId)
      ) {
        // if merchant want to update
        const validation = adminUpdateValidation(data)
        if (validation.valid) {
          const updated = await Merchant.updateOne(
            {
              _id: userDetails._id,
              status: { $ne: 'deleted' }
            },
            data
          )
          if (updated && updated.nModified < updated.n) {
            const message = ADMIN_MESSAGES.NO_UPDATE
            response.errorResponse(res, message)
          } else if (updated && updated.nModified >= 1) {
            const message = ADMIN_MESSAGES.MERCHANT_UPDATED
            response.successResponse(res, message)
          } else {
            const message = ADMIN_MESSAGES.FAILED_TO_UPDATE
            response.errorResponse(res, message)
          }
        } else {
          const errors = validation.errors
          const message = ADMIN_MESSAGES.FAILED_TO_UPDATE
          response.errorResponse(res, message, errors)
        }
      } else {
        const message = ADMIN_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

// if admin wants to update merchant's status
router
  .route('/update-merchant-status/:id')
  .put(userAuthorization.validateMerchant, async (req, res) => {
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    const receivedUserRole = req.role
    const id = req.params.id
    const data = req.body
    // checks, auth-token is empty
    if (!isAuthTokenEmpty) {
      // checks, role is admin
      if (receivedUserRole === ROLE.ADMIN) {
        // checks, id is valid
        if (mongoose.Types.ObjectId.isValid(id)) {
          const validation = UpdateStatusValidation(data)
          if (validation.valid) {
            const updatedStatus = await Merchant.updateOne(
              {
                _id: id
              },
              {
                status: data.status,
                description: data.description
              }
            )
            if (updatedStatus && updatedStatus.nModified < updatedStatus.n) {
              const message = ADMIN_MESSAGES.NO_UPDATE
              response.errorResponse(res, message)
            } else if (updatedStatus && updatedStatus.nModified >= 1) {
              const updatedData = await Merchant.findOne(
                { _id: id },
                'firstname lastname email phoneNumber status role description'
              )
              if (updatedData && updatedData._id) {
                const message = ADMIN_MESSAGES.MERCHANT_UPDATED
                response.successResponse(res, message, updatedData)
              } else {
                const message = ADMIN_MESSAGES.FAILED_TO_UPDATE
                response.errorResponse(res, message)
              }
            } else {
              const message = ADMIN_MESSAGES.FAILED_TO_UPDATE
              response.errorResponse(res, message)
            }
          } else {
            const errors = validation.errors
            const message = ADMIN_MESSAGES.FAILED_TO_UPDATE
            response.errorResponse(res, message, errors)
          }
        } else {
          const message = ADMIN_MESSAGES.INVALID_ID
          response.errorResponse(res, message)
        }
      } else {
        const message = ADMIN_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

router
  .route('/delete-merchant/:id')
  .delete(userAuthorization.validateMerchant, async (req, res) => {
    const data = req.body
    const id = req.params.id
    const receivedUserId = req.userId
    const receivedUserRole = req.role
    const isAuthTokenEmpty = req.isAuthTokenEmpty
    if (!isAuthTokenEmpty) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        if (receivedUserRole === ROLE.ADMIN || receivedUserId == id) {
          const validation = deleteValidation(data)
          if (validation.valid) {
            const updated = await Merchant.updateOne(
              {
                _id: id,
                status: { $ne: 'deleted' }
              },
              {
                status: 'deleted',
                data
              }
            )
            if (updated && updated.nModified < updated.n) {
              const message = ADMIN_MESSAGES.ALREADY_DELETED
              response.errorResponse(res, message)
            } else if (updated && updated.nModified >= 1) {
              const message = ADMIN_MESSAGES.MERCHANT_DELETED
              response.successResponse(res, message, data)
            } else {
              const message = ADMIN_MESSAGES.FAILED_TO_DELETE
              response.errorResponse(res, message)
            }
          } else {
            const errors = validation.errors
            const message = ADMIN_MESSAGES.FAILED_TO_DELETE
            response.errorResponse(res, message, errors)
          }
        } else {
          const message = ADMIN_MESSAGES.ACCESS_DENIED
          response.errorResponse(res, message)
        }
      } else {
        const message = ADMIN_MESSAGES.INVALID_ID
        response.errorResponse(res, message)
      }
    } else {
      const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
      response.errorResponse(res, message)
    }
  })

module.exports = router
