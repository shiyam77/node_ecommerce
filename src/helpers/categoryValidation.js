const { CATEGORY_VALIDATION } = require('../helpers/const')

const categoryValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.categoryName) {
      errors.push(CATEGORY_VALIDATION.NAME_IS_EMPTY)
      valid = false
    }
    if (!data.imageUrl) {
      errors.push(CATEGORY_VALIDATION.IMAGE_IS_EMPTY)
      valid = false
    }
    if (!data.shortDescription) {
      errors.push(CATEGORY_VALIDATION.SHORT_DISCRIPTION_IS_EMPTY)
      valid = false
    }
    if (!data.subcategory) {
      errors.push(CATEGORY_VALIDATION.SUBCATEGORY_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(CATEGORY_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = {
  categoryValidation
}
