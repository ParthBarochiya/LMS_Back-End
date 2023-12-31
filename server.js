const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const db = require('./utils/database')
const ErrorMiddleware = require('./middleware/error')
const userRouter = require('./routes/user.route')


require('dotenv').config()

app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(cors())

app.use('/api/v1/', userRouter)

app.get('/', cors(), function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for a Single Route' })
})

app.all("*", (req,res) => {
    res.status(500).send('invalid request')
})

app.use(ErrorMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`server connect on ${process.env.PORT}`);
    db()
})