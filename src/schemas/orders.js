const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const orderSchema = new Schema({
  orderName: { type: String },
  orderSlug: { type: String, slug: 'orderName', unique: true },
  sku: { type: String },
  actualPrice: { type: Number },
  description: { type: String },
  color: { type: String },
  images: [String],
  soldCount: { type: Number },
  rating: { type: Number },
  inStockCount: { type: Number },
  category: { type: String },
  tags: [String],
  keywords: [String],
  status: {
    type: String,
    enum: ['pending', 'active', 'InActive', 'deleted'],
    default: 'pending'
  },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
})

module.exports = orderSchema
