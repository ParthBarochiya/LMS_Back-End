const mongoose = require('mongoose')
require('dotenv').config()

const db = async () => { 
    await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("database connect successfully");
}).catch(err => {
    console.log(err)})
}

module.exports = db