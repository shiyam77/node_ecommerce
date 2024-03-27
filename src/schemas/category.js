const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const categorySchema = new Schema({
  categoryName: { type: String },
  categorySlug: { type: String, slug: 'categoryName', unique: true },
  imageUrl: { type: String },
  shortDescription: { type: String },
  subCategory: { type: Object },
  status: {
    type: String,
    enum: ['pending', 'active', 'InActive', 'deleted'],
    default: 'pending'
  },
  createdOn: { type: Date, default: Date.now },
  updateOn: { type: Date, default: Date.now }
})

module.exports = categorySchema
