const { BRAND_VALIDATION } = require('../helpers/const')

const brandValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.name) {
      errors.push(BRAND_VALIDATION.NAME_IS_EMPTY)
      valid = false
    }
    if (!data.type) {
      errors.push(BRAND_VALIDATION.TYPE_IS_EMPTY)
      valid = false
    }
    if (!data.shortDescription) {
      errors.push(BRAND_VALIDATION.SHORT_DISCRIPTION_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(BRAND_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = { brandValidation }
