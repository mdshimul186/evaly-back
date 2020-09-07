const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required:true
    },
    lastName:{
        type: String,
        trim: true,
        required:true
    },
    email:{
        type:String,
        trim: true,
        unique: true,
        lowercase: true,
        required:true
        
    },
    userName: {
        type: String,
        trim: true,
        unique:true,
        lowercase: true,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    role:{
        type: String,
        default: 'customer'
    },
    date:{
        type: Date,
        default: Date.now
    } 

})


const User = mongoose.model('User', userSchema)
module.exports = User