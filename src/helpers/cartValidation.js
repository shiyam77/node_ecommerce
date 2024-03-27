const { CART_VALIDATION } = require('../helpers/const')

const cartProductValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.cartName) {
      errors.push(CART_VALIDATION.NAME_IS_EMPTY)
      valid = false
    }
    if (!data.sku) {
      errors.push(CART_VALIDATION.SKU_IS_EMPTY)
      valid = false
    }
    if (!data.actualPrice) {
      errors.push(CART_VALIDATION.ACTUAL_PRICE_IS_EMPTY)
      valid = false
    }
    if (!data.description) {
      errors.push(CART_VALIDATION.DESCRIPTION_IS_EMPTY)
      valid = false
    }
    if (!data.images) {
      errors.push(CART_VALIDATION.IMAGES_IS_EMPTY)
      valid = false
    }
    if (!data.rating) {
      errors.push(CART_VALIDATION.RATING_IS_EMPTY)
      valid = false
    }
    if (!data.inStockCount) {
      errors.push(CART_VALIDATION.INSTOCKCOUN_IS_EMPTY)
      valid = false
    }
    if (!data.category) {
      errors.push(CART_VALIDATION.CATEGORY_IS_EMPTY)
      valid = false
    }
    if (!data.keywords) {
      errors.push(CART_VALIDATION.KEYWORDS_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(CART_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

const cartValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.userId) {
      errors.push(CART_VALIDATION.USER_ID_IS_EMPTY)
      valid = false
    }
    if (!data.count) {
      errors.push(CART_VALIDATION.COUNT_IS_EMPTY)
      valid = false
    }
    if (!data.productId) {
      errors.push(CART_VALIDATION.PRODUCT_ID_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(CART_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = { cartValidation, cartProductValidation }
