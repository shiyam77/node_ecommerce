const moment = require('moment')
const { AUTH_VALIDATION, ROLE, STATUS } = require('../helpers/const')
const { MerchantSession } = require('../models/merchant')
const { UserSession } = require('../models/user')
const response = require('../controllers/Response')
const { SESSION_ERROR } = require('../helpers/msg')

const isSessionExpired = (expireTime) => {
  const currentDate = moment().format()
  if (moment(currentDate).isAfter(expireTime)) {
    return true
  }
  return false
}

const isMerchantSessionActive = async (req, res, next) => {
  const x_authToken = req.headers['x-authtoken']
  if (x_authToken) {
    const session = await MerchantSession.findOne({
      authToken: x_authToken,
      status: { $ne: 'deleted' }
    })
    if (session && session.status === STATUS.INACTIVE) {
      const message = SESSION_ERROR.FORBIDDEN
      response.errorResponse(res, message)
    } else if (isSessionExpired(session && session.expireTime)) {
      const message = SESSION_ERROR.SESSION_EXPIRED
      response.errorResponse(res, message)
    } else {
      next()
    }
  } else {
    req.isAuthTokenEmpty = true
    next()
  }
}

const isCustomerSessionActive = async (req, res, next) => {
  const x_authToken = req.headers['x-authtoken']
  if (x_authToken) {
    const session = await UserSession.findOne({
      authToken: x_authToken,
      status: { $ne: 'deleted' }
    })
    console.log('x_authToken', x_authToken)
    console.log('session', session)
    if (session && session.status === STATUS.INACTIVE) {
      const message = SESSION_ERROR.FORBIDDEN
      response.errorResponse(res, message)
    } else if (isSessionExpired(session && session.expireTime)) {
      const message = SESSION_ERROR.SESSION_EXPIRED
      response.errorResponse(res, message)
    } else if (session === null) {
      next()
    }
  } else {
    req.isAuthTokenEmpty = true
    next()
  }
}

const checksMerchant = (isAuthTokenEmpty, role) => {
  const valid = true
  if (isAuthTokenEmpty) {
    const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
    return {
      valid: false,
      message
    }
  } else if (role === ROLE.USER || role === ROLE.ADMIN) {
    const message = AUTH_VALIDATION.FORBIDDEN
    return {
      valid: false,
      message
    }
  }
  return {
    valid
  }
}

const checksCustomer = (isAuthTokenEmpty, role) => {
  const valid = true
  if (isAuthTokenEmpty) {
    const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
    return {
      valid: false,
      message
    }
  } else if (role === ROLE.MERCHANT || role === ROLE.ADMIN) {
    const message = AUTH_VALIDATION.FORBIDDEN
    return {
      valid: false,
      message
    }
  }
  return {
    valid
  }
}

const checksAdmin = (isAuthTokenEmpty, role) => {
  const valid = true
  if (isAuthTokenEmpty) {
    const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
    return {
      valid: false,
      message
    }
  } else if (role === ROLE.MERCHANT || role === ROLE.USER) {
    const message = AUTH_VALIDATION.FORBIDDEN
    return {
      valid: false,
      message
    }
  }
  return {
    valid
  }
}

module.exports = {
  isSessionExpired,
  isMerchantSessionActive,
  isCustomerSessionActive,
  checksMerchant,
  checksCustomer,
  checksAdmin
}
