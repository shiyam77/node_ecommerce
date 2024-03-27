const mongoose = require('mongoose')
const cartSchema = require('../schemas/cart')

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart
