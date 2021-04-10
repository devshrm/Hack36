const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content:String,
    createdOn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    createdBy:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        name:String
    },
    createdAt:{
        type : Date,
        default: Date.now()
    }

});


const Comment = mongoose.model('Comment' , CommentSchema);
module.exports = Comment;