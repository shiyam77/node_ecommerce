const { STATUS } = require('../helpers/const')

class Response {
  successResponse (res, message, data) {
    res.json({
      status: STATUS.SUCCESS,
      message,
      data
    })
  }

  errorResponse (res, message, data, errors) {
    res.json({
      status: STATUS.ERROR,
      message,
      errors,
      data
    })
  }
}

module.exports = new Response()
