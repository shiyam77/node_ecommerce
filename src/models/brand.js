const mongoose = require('mongoose')
const Schema = require('../schemas/brand')

const Brand = mongoose.model('Brand', Schema)

module.exports = Brand
