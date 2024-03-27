require('dotenv').config()
const mongoose = require('mongoose')
const AdminConfig = require('./AdminConfig')

mongoose.connect(
  process.env.MONGO_URL,
  { useCreateIndex: true, useNewUrlParser: true },
  error => {
    if (error) {
      console.log('Please make sure Mongodb is installed and running!')
      throw error
    }
  }
)

AdminConfig.configureAdmin()
