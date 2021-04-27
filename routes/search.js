const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

router.get('/' , (req,res)=>{
    res.render('search.ejs',{title : 'Search' , users : 'Empty' , check : 0})
});

router.post('/' , async (req,res)=>{
    var value = req.body.search;
    const users = await User.fuzzySearch(value);
    res.render('search.ejs',{title : 'Search' , users : users, check : 1});
})

module.exports = router;