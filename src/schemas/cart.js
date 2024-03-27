const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
  count: { type: Number },
  status: {
    type: String,
    enum: ['active', 'InActive', 'deleted'],
    default: 'active'
  },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
})

module.exports = cartSchema
