const ADMIN_MESSAGES = {
  USER_ALREADY_PRESENT: 'User already present',
  MERCHANT_CREATED_SUCCESSFULLY: 'Merchant created successfully.',
  UNABLE_TO_CREATED_A_MERCHANT: 'Unable to create a merchant.',
  UNABLE_TO_CREATE_PASSWORD: 'Unable to create a password merchant.',
  FIELDS_MISSING: 'One or more fields missing to create merchant.',
  MERCHANT_LIST: 'Merchant list',
  FAILED_TO_USER_LIST: 'Failed to get merchant list',
  FAILED_TO_USER: 'Failed to get merchant',
  INVALID_ID: 'Invalid id',
  MERCHANT_UPDATED: 'Merchant updated',
  FAILED_TO_UPDATE: 'Failed to update merchant.',
  NO_UPDATE: 'No update happened',
  MERCHANT_DELETED: 'Merchant deleted',
  ALREADY_DELETED: 'Merchant already deleted',
  FAILED_TO_DELETE: 'Failed to delete merchant.',
  ACCESS_DENIED: 'Access denied!',
  UNABLE_TO_LOGOUT: 'Unable to logout merchant!',
  LOGGED_OUT: 'Logged out successfully!'
}

const CATEGORY_MESSAGES = {
  ALREADY_PRESENT: 'Category already present.',
  CREATED_SUCCESFULLY: 'Category created successfully.',
  UNABLE_TO_CREATE_CATEGORY: 'Unable to create a category.',
  FIELDS_MISSING: 'One or more fields missing to create category.',
  CATEGORY_LIST: 'Category list',
  FAILED_TO_CATEGORY_LIST: 'Failed to get category list',
  FAILED_TO_GET_CATEGORY: 'Failed to get category',
  CATEGORY_UPDATED: 'Category Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update category',
  INVALID_ID: 'Invalid id',
  CATEGORY_DELETED: 'Category deleted successfully',
  ALREADY_DELETED: 'Category already deleted',
  FAILED_TO_DELETE: 'Failed to deleted category'
}

const BRAND_MESSAGES = {
  ALREADY_PRESENT: 'Brand already present.',
  CREATED_SUCCESFULLY: 'Brand created successfully.',
  UNABLE_TO_CREATE_BRAND: 'Unable to create a brand.',
  FIELDS_MISSING: 'One or more fields missing to create brand.',
  BRAND_LIST: 'Brand list',
  FAILED_TO_BRAND_LIST: 'Failed to get brand list',
  FAILED_TO_GET_BRAND: 'Failed to get brand',
  BRAND_UPDATED: 'Brand Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update brand',
  INVALID_ID: 'Invalid id',
  BRAND_DELETED: 'Brand deleted successfully',
  ALREADY_DELETED: 'Brand already deleted',
  FAILED_TO_DELETE: 'Failed to deleted brand'
}

const AUTH_MESSAGES = {
  ALREADY_PRESENT: 'Authentication already present.',
  CREATED_SUCCESFULLY: 'Authentication created successfully.',
  UNABLE_TO_CREATE_AUTHENTICATION: 'Unable to create a authentication.',
  FIELDS_MISSING: 'One or more fields missing to create authentication.',
  AUTHENTICATION_LIST: 'Authentication list',
  FAILED_TO_AUTHENTICATION_LIST: 'Failed to get authentication list',
  FAILED_TO_GET_AUTHENTICATION: 'Failed to get authentication',
  AUTHENTICATION_UPDATED: 'Authentication Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update authentication',
  INVALID_ID: 'Invalid id',
  AUTHENTICATION_DELETED: 'Authentication deleted successfully',
  FAILED_TO_DELETE: 'Failed to deleted authentication',
  AUTHENTICATION_SUCCESS: 'Authentication success!',
  ENTER_VALID_EMAIL_PASSWORD: 'Please enter valid email and password.',
  INVALID_PASSWORD: 'your password is inValid.',
  UNABLE_TO_CREATE_SESSION: 'unable to create session.',
  ACCESS_DENIED: 'Access denied!'
}

const PRODUCT_MESSAGES = {
  ALREADY_PRESENT: 'Product already present.',
  CREATED_SUCCESFULLY: 'Product created successfully.',
  UNABLE_TO_CREATE: 'Unable to create a product.',
  FIELDS_MISSING: 'One or more fields missing to create product.',
  PRODUCT_LIST: 'Product list',
  FAILED_TO_PRODUCT_LIST: 'Failed to get product list',
  FAILED_TO_GET_PRODUCT: 'Failed to get product',
  PRODUCT_UPDATED: 'Product Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update product',
  INVALID_ID: 'Invalid id',
  PRODUCT_DELETED: 'Product deleted successfully',
  ALREADY_DELETED: 'Product already deleted',
  FAILED_TO_DELETE: 'Failed to deleted product',
  UPLOADED_SUCCESSFULLY: 'Images uploaded successfully',
  FAILED_TO_UPLOAD: 'Failed to upload Images',
  CHOSE_FILE: 'Choose some file to upload!',
  ACCESS_DENIED: 'Access denied!',
  ENTER_STATUS: 'Please enter status!'
}

const FILE_UPLOADER_MESSAGES = {
  UPLOADED_SUCCESSFULLY: 'Images uploaded successfully',
  FAILED_TO_UPLOAD: 'Failed to upload Images',
  CHOSE_FILE: 'Choose some file to upload!'
}

const USER_MESSAGES = {
  ALREADY_PRESENT: 'User already present.',
  CREATED_SUCCESFULLY: 'User created successfully.',
  UNABLE_TO_CREATE: 'Unable to create a user.',
  FIELDS_MISSING: 'One or more fields missing to create user.',
  USER_LIST: 'User list',
  FAILED_TO_USER_LIST: 'Failed to get user list',
  FAILED_TO_GET_USER: 'Failed to get user',
  USER_UPDATED: 'User Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update user',
  INVALID_ID: 'Invalid id',
  USER_DELETED: 'User deleted successfully',
  ALREADY_DELETED: 'User already deleted',
  FAILED_TO_DELETE: 'Failed to deleted user',
  ACCESS_DENIED: 'Access denied!',
  UNABLE_TO_LOGOUT: 'Unable to logout merchant!',
  LOGGED_OUT: 'Logged out successfully!'
}

const CART_MESSAGES = {
  ALREADY_PRESENT: 'Cart already present.',
  CREATED_SUCCESFULLY: 'Cart created successfully.',
  UNABLE_TO_CREATE: 'Unable to create a Cart.',
  FIELDS_MISSING: 'One or more fields missing to create Cart.',
  CART_LIST: 'Cart list',
  FAILED_TO_CART_LIST: 'Failed to get Cart list',
  FAILED_TO_GET_CART: 'Failed to get Cart',
  CART_UPDATED: 'Cart Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update Cart',
  INVALID_ID: 'Invalid id',
  CART_DELETED: 'Cart product deleted successfully',
  ALREADY_DELETED: 'Cart product already deleted',
  FAILED_TO_DELETE: 'Failed to deleted Cart product',
  ACCESS_DENIED: 'Access denied!'
}

const ORDERS_MESSAGES = {
  ALREADY_PRESENT: 'Order already present.',
  CREATED_SUCCESFULLY: 'Order created successfully.',
  UNABLE_TO_CREATE: 'Unable to create a Order.',
  FIELDS_MISSING: 'One or more fields missing to create Order.',
  ORDERS_LIST: 'Order list',
  FAILED_TO_ORDERS_LIST: 'Failed to get Order list',
  FAILED_TO_GET_ORDER: 'Failed to get Order',
  ORDERS_UPDATED: 'Order Updated successfully',
  NO_UPDATE: 'No update happened',
  FAILED_UPDATED: 'Failed to update Order',
  INVALID_ID: 'Invalid id',
  ORDERS_DELETED: 'Order product deleted successfully',
  ALREADY_DELETED: 'Order product already deleted',
  FAILED_TO_DELETE: 'Failed to deleted Order product'
}

const SESSION_ERROR = {
  FORBIDDEN: 'You are forbidden due to session Inactive!',
  SESSION_EXPIRED: 'Session Expired!'
}

module.exports = {
  CATEGORY_MESSAGES,
  ADMIN_MESSAGES,
  BRAND_MESSAGES,
  AUTH_MESSAGES,
  PRODUCT_MESSAGES,
  USER_MESSAGES,
  CART_MESSAGES,
  ORDERS_MESSAGES,
  SESSION_ERROR,
  FILE_UPLOADER_MESSAGES
}
