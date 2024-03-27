const { AUTH_VALIDATION } = require('../helpers/const')

const authValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.userId) {
      errors.push(AUTH_VALIDATION.USER_ID_IS_EMPTY)
      valid = false
    }
    if (!data.authToken) {
      errors.push(AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(AUTH_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = { authValidation }
