const { UserSession } = require('../models/user')
const { MerchantSession } = require('../models/merchant')
const response = require('./Response')
const { AUTH_MESSAGES } = require('../helpers/msg')

class isAuthorized {
  async validateUser (req, res, next) {
    console.log('customer checkst')
    const x_authToken = req.headers['x-authtoken']
    if (x_authToken) {
      const session = await UserSession.findOne({
        authToken: x_authToken,
        status: { $ne: 'deleted' }
      })
      console.log('customer session', session)
      if (session && session.userId) {
        req.userId = session.userId
        req.role = session.role
        req.userStatus = session.status
        req.expireTime = session.expireTime
        req.isAuthTokenEmpty = false
        next()
      } else {
        const message = AUTH_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      req.isAuthTokenEmpty = true
      next()
    }
  }

  async validateMerchant (req, res, next) {
    const x_authToken = req.headers['x-authtoken']
    if (x_authToken) {
      const session = await MerchantSession.findOne({
        authToken: x_authToken,
        status: { $ne: 'deleted' }
      })
      console.log('merchant session', session)
      if (session && session.userId) {
        req.userId = session.userId
        req.role = session.role
        req.userStatus = session.status
        req.expireTime = session.expireTime
        req.isAuthTokenEmpty = false
        next()
      } else {
        const message = AUTH_MESSAGES.ACCESS_DENIED
        response.errorResponse(res, message)
      }
    } else {
      req.isAuthTokenEmpty = true
      next()
    }
  }
}

module.exports = isAuthorized
