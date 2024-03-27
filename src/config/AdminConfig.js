const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const saltRounds = process.env.BCRYPT_SALT_ROUNDS
  ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
  : 8
const _ = require('lodash')

exports.configureAdmin = function () {
  const name = 'Admin'
  const email = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  const role = 'admin'
  const status = 'active'
  Admin.findOne({ email }, (err, user) => {
    if (err) {
      console.log('Error getting admin details')
    } else if (_.isEmpty(user)) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log('Failed to configure admin')
        } else {
          const newUser = new Admin({
            name,
            email,
            password: hash,
            role,
            status
          })
          newUser.save((err, user) => {
            if (err) {
              console.log('err', err)
              console.log('Admin configured successfully')
            } else {
              console.log('Admin configured successfully')
            }
          })
        }
      })
    } else {
      console.log('Admin already configured!')
    }
  })
}
