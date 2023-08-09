const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phoneNumber :{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },

    country:{
        type:String,
        required:true
    },
    zipCode:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },


}, {timestamps:true,})

const User = mongoose.model('User', userSchema)

module.exports = User