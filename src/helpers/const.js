const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  ACTIVE: 'active',
  INACTIVE: 'inActive',
  DELETED: 'deleted'
}

const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  CUSTOMER: 'customer',
  MERCHANT: 'merchant'
}

const ADMIN_VALIDATION = {
  ENTER_FIRSTNAME: 'Please enter firstname',
  ENTER_LASTNAME: 'Please enter lastname',
  ENTER_PHONE_NUMBER: 'Please enter phoneNumber',
  ENTER_EMAIL: 'Please enter email',
  ENTER_PASSWORD: 'Please enter password',
  ENTER_ROLE: 'Please enter role',
  ENTER_STATUS: 'Please enter status',
  ENTER_DESCRIPTION: 'Please enter description',
  PROVIDE_VALID_DETAILS: 'Please provide valid details to create merchant.',
  UPDATE_FEW_ONLY: 'You can update name and password only!'
}

const CATEGORY_VALIDATION = {
  NAME_IS_EMPTY: "category's name is empty!",
  IMAGE_IS_EMPTY: "category's image is empty!",
  SHORT_DISCRIPTION_IS_EMPTY: "category's shortDescription is empty!",
  SUBCATEGORY_IS_EMPTY: 'subcategory is empty!',
  PROVIDE_VALID_DETAILS: 'Please provide valid details to create category.'
}

const BRAND_VALIDATION = {
  NAME_IS_EMPTY: "brand's name is empty!",
  TYPE_IS_EMPTY: "brand's type is empty!",
  SHORT_DISCRIPTION_IS_EMPTY: "brand's shortDescription is empty!",
  PROVIDE_VALID_DETAILS: 'Please provide valid details to create brand.'
}

const AUTH_VALIDATION = {
  USER_ID_IS_EMPTY: 'user id is empty!',
  AUTH_TOKEN_IS_EMPTY: 'auth token is empty!',
  FORBIDDEN: 'You are forbidden!',
  PROVIDE_VALID_DETAILS: 'Please provide valid details.'
}

const PRODUCT_VALIDATION = {
  NAME_IS_EMPTY: 'product name is empty!',
  SLUG_IS_EMPTY: 'product slug is empty!',
  SKU_IS_EMPTY: 'product sku is empty!',
  ACTUAL_PRICE_IS_EMPTY: 'actual price is empty',
  DESCRIPTION_IS_EMPTY: 'description is empty',
  IMAGES_IS_EMPTY: 'images is empty',
  RATING_IS_EMPTY: 'rating is empty',
  INSTOCKCOUN_IS_EMPTY: 'inStockCount is empty',
  CATEGORY_IS_EMPTY: 'category is empty',
  KEYWORDS_IS_EMPTY: 'keywords is empty',
  PROVIDE_VALID_DETAILS: 'Please provide valid details to create product.'
}

const USER_VALIDATION = {
  ENTER_FIRSTNAME: 'Please enter firstname',
  ENTER_LASTNAME: 'Please enter lastname',
  ENTER_PHONE_NUMBER: 'Please enter phoneNumber',
  ENTER_EMAIL: 'Please enter email',
  ENTER_PASSWORD: 'Please enter password',
  ENTER_ROLE: 'Please enter role',
  PROVIDE_VALID_DETAILS: 'Please provide valid details.'
}

const CART_VALIDATION = {
  NAME_IS_EMPTY: 'Cart name is empty!',
  SKU_IS_EMPTY: 'Cart sku is empty!',
  ACTUAL_PRICE_IS_EMPTY: 'actual price is empty',
  DESCRIPTION_IS_EMPTY: 'description is empty',
  IMAGES_IS_EMPTY: 'images is empty',
  RATING_IS_EMPTY: 'rating is empty',
  INSTOCKCOUN_IS_EMPTY: 'inStockCount is empty',
  CATEGORY_IS_EMPTY: 'category is empty',
  KEYWORDS_IS_EMPTY: 'keywords is empty',
  PRODUCT_ID_IS_EMPTY: 'Product id is empty',
  COUNT_IS_EMPTY: 'Count is empty',
  USER_ID_IS_EMPTY: 'User Id is empty',
  PROVIDE_VALID_DETAILS: 'Please provide valid details to create Cart.'
}

const ORDER_VALIDATION = {
  NAME_IS_EMPTY: 'Ordered product name is empty!',
  SKU_IS_EMPTY: 'Ordered product sku is empty!',
  ACTUAL_PRICE_IS_EMPTY: 'actual price is empty',
  DESCRIPTION_IS_EMPTY: 'description is empty',
  IMAGES_IS_EMPTY: 'images is empty',
  RATING_IS_EMPTY: 'rating is empty',
  INSTOCKCOUN_IS_EMPTY: 'inStockCount is empty',
  CATEGORY_IS_EMPTY: 'category is empty',
  KEYWORDS_IS_EMPTY: 'keywords is empty',
  PROVIDE_VALID_DETAILS: 'Please provide valid details to create Order.'
}

module.exports = {
  STATUS,
  ADMIN_VALIDATION,
  CATEGORY_VALIDATION,
  BRAND_VALIDATION,
  AUTH_VALIDATION,
  PRODUCT_VALIDATION,
  CART_VALIDATION,
  USER_VALIDATION,
  ORDER_VALIDATION,
  ROLE
}
