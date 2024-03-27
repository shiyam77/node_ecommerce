const mongoose = require('mongoose')
const userSchema = require('../schemas/user')
const sessionSchema = require('../schemas/session')

const User = mongoose.model('User', userSchema)
const UserSession = mongoose.model('UserSession', sessionSchema)

module.exports = { User, UserSession }
