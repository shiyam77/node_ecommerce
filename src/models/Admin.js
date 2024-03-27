const mongoose = require('mongoose')
const adminSchema = require('../schemas/adminSchema')

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin
