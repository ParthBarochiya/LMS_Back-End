const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter your name"]
    },
    email : {
        type: String,
        required : [true, "please enter your email"],
        validate : {
            validator : function(value){
                return true
            },
            message : "please enter valid email"
        },
        unique : true
    },
    password : {
        type : String,
        required: [true, "please enter your password"],
        minlength : [6, "password must be at least 6 characters"],
        select : false
    },
    avatar : {
        public_id : String,
        url : String
    },
    role : {
        type:String,
        default : "user"
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    courses : [
        {
            courseId : String,

        }
    ]
},{timestamps:true});


// for hash password
userSchema.pre('save', async(next) => {
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next()
})

// compare password

userSchema.methods.comparePassword = async (enterPassword) => {
    return await bcrypt.compare(enterPassword, this.password);
}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel