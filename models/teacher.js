const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name:String,
    latitude:Number,
    longitude:Number,
    maxBatch:{
        type:Number,
        default:10
    },
    curBatch:{
        type:Number,
        default:0
    }
});

const Teacher = mongoose.model('Teacher' , TeacherSchema);
module.exports = Teacher;