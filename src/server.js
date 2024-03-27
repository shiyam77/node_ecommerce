require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const { AUTH_VALIDATION, ROLE } = require('./helpers/const')
const { FILE_UPLOADER_MESSAGES, AUTH_MESSAGES } = require('./helpers/msg')
const response = require('./controllers/Response')
var multer = require('multer')
var upload = multer({ dest: 'uploads/images/' })
const fs = require('fs')
const isAuthorized = require('./controllers/isAuthorized')
const userAuthorization = new isAuthorized()

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

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'server is online!'
  })
})

app.get('/image/:id', (req, res) => {
  const filename = req.params.id
  fs.readFile(`uploads/images/${filename}`, (err, data) => {
    if (!err) {
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.write(data)
      res.end()
    } else {
      res.status(404).send('invalid Image Name')
    }
  })
})

app
  .post('/upload-image',
    userAuthorization.validateMerchant,
    upload.single('image'),
    async (req, res) => {
      const { file } = req
      const isAuthTokenEmpty = req.isAuthTokenEmpty
      const receivedUserRole = req.role
      if (!isAuthTokenEmpty) {
        if (
          receivedUserRole === ROLE.MERCHANT ||
          receivedUserRole === ROLE.ADMIN
        ) {
          if (file) {
            const data = {
              fileName: file.filename,
              originalname: file.originalname
            }
            const message = FILE_UPLOADER_MESSAGES.UPLOADED_SUCCESSFULLY
            response.successResponse(res, message, data)
          } else {
            const message = FILE_UPLOADER_MESSAGES.FAILED_TO_UPLOAD
            response.errorResponse(res, message)
          }
        } else {
          const message = AUTH_MESSAGES.ACCESS_DENIED
          response.errorResponse(res, message)
        }
      } else {
        const message = AUTH_VALIDATION.AUTH_TOKEN_IS_EMPTY
        response.errorResponse(res, message)
      }
    }
  )

app.use('/admin', require('./controllers/admin'))
app.use('/category', require('./controllers/category'))
app.use('/brand', require('./controllers/brand'))
app.use('/products', require('./controllers/product'))
app.use('/users', require('./controllers/user'))
app.use('/cart', require('./controllers/cart'))
app.use('/orders', require('./controllers/orders'))

app.listen(port, () => {
  console.log(`Ecommerce API Server Started! ${port}`)
})
