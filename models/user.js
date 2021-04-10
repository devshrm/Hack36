const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    latitude : Number,
    longitude : Number,
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
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]
   
    
  
});

const User = mongoose.model('User' , UserSchema);
module.exports = User;