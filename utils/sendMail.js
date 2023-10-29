const nodemailer = require('nodemailer')
const {transporter} = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
require('dotenv').config()

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host : process.env.SHIP_HOST,
        port : process.env.SHIP_PORT,
        service : process.env.SHIP_SERVICE,
        auth : {
            user : process.env.SHIP_MAIL,
            pass: process.env.SHIP_PASSWORD,
        },

    });

    const {email,subject,template,data} = options;

    const templatePath = path.join(__dirname,'../mails',template);

    const html = await ejs.renderFile(templatePath,data)

    const mailOptions = {
        from : process.env.SHIP_MAIL,
        to : email,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;