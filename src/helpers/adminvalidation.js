const { ADMIN_VALIDATION } = require('./const')

const adminValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.firstname) {
      errors.push(ADMIN_VALIDATION.ENTER_FIRSTNAME)
      valid = false
    }
    if (!data.lastname) {
      errors.push(ADMIN_VALIDATION.ENTER_LASTNAME)
      valid = false
    }
    if (!data.phoneNumber) {
      errors.push(ADMIN_VALIDATION.ENTER_PHONE_NUMBER)
      valid = false
    }
    if (!data.email) {
      errors.push(ADMIN_VALIDATION.ENTER_EMAIL)
      valid = false
    }
    if (!data.password) {
      errors.push(ADMIN_VALIDATION.ENTER_PASSWORD)
      valid = false
    }
  } else {
    errors.push(ADMIN_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

const adminUpdateValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.firstname) {
      errors.push(ADMIN_VALIDATION.ENTER_FIRSTNAME)
      valid = false
    }
    if (!data.lastname) {
      errors.push(ADMIN_VALIDATION.ENTER_LASTNAME)
      valid = false
    }
    if (!data.password) {
      errors.push(ADMIN_VALIDATION.ENTER_PASSWORD)
      valid = false
    }
  } else {
    errors.push(ADMIN_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

const UpdateStatusValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.status) {
      errors.push(ADMIN_VALIDATION.ENTER_STATUS)
      valid = false
    }
  } else {
    errors.push(ADMIN_VALIDATION.ENTER_STATUS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

const deleteValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.phoneNumber) {
      errors.push(ADMIN_VALIDATION.ENTER_PHONE_NUMBER)
      valid = false
    }
    if (!data.email) {
      errors.push(ADMIN_VALIDATION.ENTER_EMAIL)
      valid = false
    }
    if (!data.password) {
      errors.push(ADMIN_VALIDATION.ENTER_PASSWORD)
      valid = false
    }
    if (!data.description) {
      errors.push(ADMIN_VALIDATION.ENTER_DESCRIPTION)
      valid = false
    }
  } else {
    errors.push(ADMIN_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = {
  adminValidation,
  adminUpdateValidation,
  UpdateStatusValidation,
  deleteValidation
}
