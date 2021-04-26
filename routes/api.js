const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

router.post('/likes',async (req,res)=>{
    const post_id = req.body.post_id;
    const P = await Post.findOne({_id : post_id});
    P.likes += 1;
    P.save();
    res.send('Successfully updated like');
});



router.get('/message/:id',async (req, res)=>{
    
    const from = await User.findOne({ _id : req.user._id });
    const toID = req.params.id;
    const to = await User.findOne({ _id : toID});
    res.render('message',{title : 'Chat',from: from, fromName : from.name , to:to , toName : to.name  }); 
})

module.exports = router;