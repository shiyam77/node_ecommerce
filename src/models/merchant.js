const mongoose = require('mongoose')
const Schema = require('../schemas/merchant')
const sessionSchema = require('../schemas/session')

const Merchant = mongoose.model('Merchant', Schema)
const MerchantSession = mongoose.model('MerchantSession', sessionSchema)
module.exports = {
  Merchant,
  MerchantSession
}
