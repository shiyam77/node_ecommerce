const mongoose = require('mongoose')
const Schema = mongoose.Schema

const merchantSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String },
  role: {
    type: String,
    enum: ['admin', 'merchant', 'customer'],
    default: 'merchant'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inActive', 'disabled', 'deleted'],
    default: 'pending'
  },
  createdOn: { type: Date, default: Date.now },
  updateOn: { type: Date, default: Date.now }
})

module.exports = merchantSchema
