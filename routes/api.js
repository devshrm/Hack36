const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.post('/likes',async (req,res)=>{
    const post_id = req.body.post_id;
    const P = await Post.findOne({_id : post_id});
    P.likes += 1;
    P.save();
    res.send('Successfully updated like');
})

module.exports = router;