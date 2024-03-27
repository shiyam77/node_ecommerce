const mongoose = require('mongoose')
const productSchema = require('../schemas/product')

const Products = mongoose.model('Products', productSchema)
module.exports = Products
