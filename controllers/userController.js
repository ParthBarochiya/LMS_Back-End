const userModel = require('../models/userModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const ejs = require('ejs')
const sendMail = require('../utils/sendMail')
const path = require('path')

const registrationUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        console.log(name, email, password);

        if (!name || !email || !password) {
            throw new ErrorHandler("invalid datas", 400)
        }

        const isEmailExist = await userModel.findOne({ email });

        if (isEmailExist) throw new ErrorHandler("user already exist", 400)

        const user = {
            name,
            email,
            password
        }

        const activationToken = await createActivationToken(user)

        const activationCode = activationToken.activationCode;

        const data = {
            user: {
                activationCode
            }
        }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data)

        try {
            await sendMail({
                email: user.email,
                subject: "for OTP",
                template: "activation-mail.ejs",
                data
            })

            res.status(201).json({
                success: true,
                message: "plase check you mail",
                activationToken: activationToken.token
            })
        } catch (err) {
            throw new ErrorHandler(err.message, 400)
        }



    } catch (error) {
        throw new ErrorHandler(error.message, 400)
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



// activate user
const activateUser = async (req, res, next) => {
    try {
        const {activation_token, activationCode} = req.body

        console.log(activationCode, activation_token);

        const newuser = jwt.verify(
            activation_token,
            process.env.JWT_ACTIVATION_CODE
        )

        console.log(newuser);

        if(newuser.activationCode != activationCode){
            throw new ErrorHandler('invalid activation code', 400)
        }

        const {name,email,password} = newuser.user;

        const existsUser = await userModel.findOne({email});

        if(existsUser){
            throw new ErrorHandler('Email Already Exists', 400)
        }

        const user = await userModel.create({
            name,
            email,
            password
        })

        res.status(201).json({
            success : true,
        })

    } catch (err) {
        throw new ErrorHandler(err.message, 400)
    }
}


module.exports = {
    createActivationToken,
    registrationUser,
    activateUser
}