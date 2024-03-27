const { PRODUCT_VALIDATION } = require('../helpers/const')
const Products = require('../models/product')

const productValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.productName) {
      errors.push(PRODUCT_VALIDATION.NAME_IS_EMPTY)
      valid = false
    }
    if (!data.sku) {
      errors.push(PRODUCT_VALIDATION.SKU_IS_EMPTY)
      valid = false
    }
    if (!data.actualPrice) {
      errors.push(PRODUCT_VALIDATION.ACTUAL_PRICE_IS_EMPTY)
      valid = false
    }
    if (!data.description) {
      errors.push(PRODUCT_VALIDATION.DESCRIPTION_IS_EMPTY)
      valid = false
    }
    if (!data.images) {
      errors.push(PRODUCT_VALIDATION.IMAGES_IS_EMPTY)
      valid = false
    }
    if (!data.rating) {
      errors.push(PRODUCT_VALIDATION.RATING_IS_EMPTY)
      valid = false
    }
    if (!data.inStockCount) {
      errors.push(PRODUCT_VALIDATION.INSTOCKCOUN_IS_EMPTY)
      valid = false
    }
    if (!data.category) {
      errors.push(PRODUCT_VALIDATION.CATEGORY_IS_EMPTY)
      valid = false
    }
    if (!data.keywords) {
      errors.push(PRODUCT_VALIDATION.KEYWORDS_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(PRODUCT_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

const updateProductValidation = data => {
  let valid = true
  const errors = []
  if (data) {
    if (!data.productName) {
      errors.push(PRODUCT_VALIDATION.NAME_IS_EMPTY)
      valid = false
    } else if (!data.sku) {
      errors.push(PRODUCT_VALIDATION.SKU_IS_EMPTY)
      valid = false
    } else if (!data.actualPrice) {
      errors.push(PRODUCT_VALIDATION.ACTUAL_PRICE_IS_EMPTY)
      valid = false
    } else if (!data.description) {
      errors.push(PRODUCT_VALIDATION.DESCRIPTION_IS_EMPTY)
      valid = false
    } else if (!data.images) {
      errors.push(PRODUCT_VALIDATION.IMAGES_IS_EMPTY)
      valid = false
    } else if (!data.rating) {
      errors.push(PRODUCT_VALIDATION.RATING_IS_EMPTY)
      valid = false
    } else if (!data.inStockCount) {
      errors.push(PRODUCT_VALIDATION.INSTOCKCOUN_IS_EMPTY)
      valid = false
    } else if (!data.category) {
      errors.push(PRODUCT_VALIDATION.CATEGORY_IS_EMPTY)
      valid = false
    } else if (!data.keywords) {
      errors.push(PRODUCT_VALIDATION.KEYWORDS_IS_EMPTY)
      valid = false
    }
  } else {
    errors.push(PRODUCT_VALIDATION.PROVIDE_VALID_DETAILS)
    valid = false
  }
  return {
    valid,
    errors
  }
}

module.exports = {
  productValidation,
  updateProductValidation
}
