const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Teacher = require('../models/teacher.js');
const Comment = require('../models/comment.js');
const mongoose = require('mongoose');

//GET
router.get('/', ensureAuthenticated, (req, res) => {
    Post.find().sort({ createdAt: -1 }).then((result) => {
        res.render('home', { posts: result });
    }).catch((err) => { console.log(err); });

});

router.get('/my-profile', (req, res) => {

    let id = req.user._id;

    console.log(id)
    res.redirect('/home/profile/' + id);
})

router.get('/findTeacher', (req, res) => {
    Teacher.find().sort({ createdAt: -1 }).populate('id').exec((err , result) => {
       
        res.render('findTeacher', { title: 'Find teacher', teacher: result });
    })

});

router.get('/findTeacher/map', (req, res) => {
    User.findById(req.user._id, (err, USER) => {
        if (err) {
            console.log(err);
            res.redirect('/home');
        } else {
            Teacher.find().then((result) => {
               
                res.render('findByMap', { title: 'Map', user: USER, teachers: result });
            }).catch(err => console.log(err))
        }
    })

})
router.get('/writePost', (req, res) => {
    res.render('WritePost');
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id).populate('comments').exec((err, post) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Error" });
        }
       
        res.render('post', { post: post, title: 'Question' });

    })

});


router.get('/profile/:id', (req, res) => {
    
    let id = req.params.id;
    id = mongoose.Types.ObjectId(id);
    User.findById(id).populate('posts').exec(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Error" });
        }
        if(user.role === 'Student'){
            res.render('profile', { title: 'Profile', user: user });
        }else{
            Teacher.findOne({id : user._id} , (error , teacher)=>{
                res.render('profile', { title: 'Profile', user: user ,teacher : teacher });
            })
        }
        
        
    })
});




//POST

router.post('/writePost', (req, res) => {
    const str = req.body.tags;
    const str1 = str.split(' ');
    var post = new Post({
        title: req.body.Title,
        content: req.body.Content,
        tags: str1
    });
    console.log(req.user);
    User.findById(req.user._id, (err, pUSER) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            Post.create(post, (err, post) => {
                if (err) {
                    console.log(err);
                    res.redirect('/home');
                } else {
                    console.log(post);

                    post.createdBy.name = pUSER.name;
                    post.createdBy.id = pUSER;
                    pUSER.posts.unshift(post);

                    pUSER.save().then(result => {
                        post.save()
                            .then((result) => {
                                res.redirect('/home');
                            }).catch((err) => { console.log(err) });

                    })


                }
            })
        }
    })
});


router.post('/join' , async (req,res)=> {
    const email = req.body.email;
    
    const user = await User.findOne({email : email});  
    const teacher = await Teacher.findOne({id : user._id});
    console.log(user.myTeacher, teacher._id)

    if(user.myTeacher.equals(teacher._id) ){
        res.send('You have already joined');
    }else if((teacher.curBatch < teacher.maxBatch) ){
        teacher.curBatch += 1;
        teacher.save();
        user.myTeacher = teacher;
        user.save();
        res.send('Successful')
    }else{
        res.send('Batch is full')
    }
    
    
    
})

router.post('/:id', (req, res) => {
    const id = req.params.id;

    User.findById(req.user._id, (err, user) => {




        var comment = new Comment({
            content: req.body.content,
            createdOn: id,
            createdBy: {
                id: req.user._id,
                name: user.name
            }
        })

        comment.save((err, cmnt) => {
            if (err) {
                return console.log(err);

            }

            Post.findByIdAndUpdate(id, { $push: { "comments": cmnt._id } }, (error, pst) => {
                if (error) {
                    return console.log(error)
                }
                res.redirect('/home/' + id);


            })

        })


    })

});




module.exports = router;