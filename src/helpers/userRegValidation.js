const { USER_VALIDATION } = require('./const')

const userRegValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.firstName) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_FIRSTNAME)
    }
    if (!data.lastName) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_LASTNAME)
    }
    if (!data.phoneNumber) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_PHONE_NUMBER)
    }
    if (!data.email) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_EMAIL)
    }
    if (!data.password) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_PASSWORD)
    }
    return {
      valid,
      errors
    }
  } else {
    errors.push(USER_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
}

const updateUserValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.firstName) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_FIRSTNAME)
    }
    if (!data.lastName) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_LASTNAME)
    }
    if (!data.phoneNumber) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_PHONE_NUMBER)
    }
    if (!data.password) {
      valid = false
      errors.push(USER_VALIDATION.ENTER_PASSWORD)
    }
    return {
      valid,
      errors
    }
  } else {
    errors.push(USER_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
}

module.exports = { userRegValidation, updateUserValidation }
