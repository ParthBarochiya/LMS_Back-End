const userModel = require('../models/userModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const ejs = require('ejs')

const registrationUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            throw new ErrorHandler("invalid data", 400)
        }

        const isEmailExist = await userModel.findOne(email);

        if (isEmailExist) throw new ErrorHandler("user already exist", 400)

        const user = {
            name,
            email,
            password
        }

        const activationToken = createActivationToken(user)
   
        const activationCode = activationToken.activationCode;

        const data ={
            user : {
                name : user.name,
                activationCode
            }
        }

        const html = await ejs.renderFile(path.join(__dirname, ""))

        
   
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}



const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 * Math.random() * 5000).toString()

    const token = jwt.sign({
        user, activationCode
    },
        process.env.JWT_ACTIVATION_CODE, {
        expiresIn: "10m"
    }
    )

    return { token, activationCode };
}

module.exports = {
    createActivationToken,
    registrationUser
}