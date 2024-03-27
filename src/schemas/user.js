const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'merchant', 'customer'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'disabled', 'deleted'],
    default: 'pending'
  },
  createdOn: { type: Date, default: Date.now },
  updateOn: { type: Date, default: Date.now }
})

module.exports = userSchema
