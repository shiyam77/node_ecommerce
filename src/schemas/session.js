const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionSchema = new Schema({
  userId: { type: String, required: true },
  authToken: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'merchant', 'customer', 'user'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'logout'],
    default: 'logout'
  },
  expireTime: { type: Date, required: true },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
})

module.exports = sessionSchema
