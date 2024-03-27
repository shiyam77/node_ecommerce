const { ORDER_VALIDATION } = require('../helpers/const')

const orderValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.orderName) {
      errors.push(ORDER_VALIDATION.NAME_IS_EMPTY)
      valid = false
    }
    if (!data.sku) {
      errors.push(ORDER_VALIDATION.SKU_IS_EMPTY)
      valid = false
    }
    if (!data.actualPrice) {
      errors.push(ORDER_VALIDATION.ACTUAL_PRICE_IS_EMPTY)
      valid = false
    }
    if (!data.description) {
      errors.push(ORDER_VALIDATION.DESCRIPTION_IS_EMPTY)
      valid = false
    }
    if (!data.images) {
      errors.push(ORDER_VALIDATION.IMAGES_IS_EMPTY)
      valid = false
    }
    if (!data.rating) {
      errors.push(ORDER_VALIDATION.RATING_IS_EMPTY)
      valid = false
    }
    if (!data.inStockCount) {
      errors.push(ORDER_VALIDATION.INSTOCKCOUN_IS_EMPTY)
      valid = false
    }
    if (!data.category) {
      errors.push(ORDER_VALIDATION.CATEGORY_IS_EMPTY)
      valid = false
    }
    if (!data.keywords) {
      errors.push(ORDER_VALIDATION.KEYWORDS_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(ORDER_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = { orderValidation }
