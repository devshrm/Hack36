const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');



router.get('/',ensureAuthenticated,(req,res)=>{
    Post.find().sort({createdAt : -1}).then((result)=>{
        res.render('home' , {posts : result});
    }).catch((err)=>{console.log(err);});
    
});



router.get('/writePost' , (req,res)=>{
    res.render('WritePost');
});

router.post('/writePost' , (req,res)=>{
    const str = req.body.tags;
    const str1 = str.split(' ');
    var post = new Post({
        title:req.body.Title,
        content : req.body.Content,
        tags : str1
    });
    console.log(req.user);
    User.findById(req.user._id , (err,pUSER)=>{
        if(err){
            console.log(err);
            res.redirect('/login');
        }else{
            Post.create(post , (err,post)=>{
                if(err){
                    console.log(err);
                    res.redirect('/home');
                }else{
                    post.createdBy.id = req.user._id;
                    post.createdBy.name = pUSER.name;
                    post.save()
                    .then((result)=>{
                        res.redirect('/home');
                    }).catch((err)=>{console.log(err)});

                }
            })
        }
    })
});


router.get('/:id' , (req,res)=>{
    const id = req.params.id;
    Post.findById(id)
        .then(result => {
            res.render('post',{post : result, title:'Question'});
        }).catch(err=>console.log(err));
});


router.get('findTeacher' , (req,res)=>{
    User.find(req.user._id,(err,USER)=>{
        if(err){
            console.log(err);
            res.redirect('/home');
        }else{
            res.render('findTeacher',{user : USER});
        }
    })
});



module.exports = router;