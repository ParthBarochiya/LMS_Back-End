const express = require('express')
const {registrationUser} =require('../controllers/userController')
const userRouter = express.Router()

userRouter.post('/registration', registrationUser)


module.exports = userRouter