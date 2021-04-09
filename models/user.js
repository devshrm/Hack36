const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role:{
        type : String,
        enum : ["Student" , "Teacher"],
        default : 'Student'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    confirmed:{
        type: Boolean,
        default: false
    }
   
    
  
});

const User = mongoose.model('User' , UserSchema);
module.exports = User;