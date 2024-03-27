const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brandSchema = new Schema({
  name: { type: String },
  type: { type: String },
  shortDescription: { type: String },
  status: {
    type: String,
    enum: ['pending', 'active', 'InActive', 'deleted'],
    default: 'pending'
  },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
})

module.exports = brandSchema
