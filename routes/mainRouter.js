const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');




router.post('/register' , (req,res)=>{
    console.log(req.body);
    const {name , email, password , confirm_password, role } = req.body;

    let errors = [];

    if(!name || !email || !password || !confirm_password)
    {
        errors.push({msg:'Please fill in all fields'});
    }

    if(password !== confirm_password){
        errors.push({msg: 'Password do not match'});
    }
    

    if(errors.length > 0){
        res.render('register');
    }else{
        User.findOne({email : email})
            .then(user =>{
                if(user){
                    console.log('User already exist');
                    prompt('User already exist');
                    res.render('register');
                }else{
                    const newUser = new User({
                        name,
                        email, 
                        password,
                        role
                    })
                    
                    //Hash Password
                    bcrypt.genSalt(10 , (err,salt)=>bcrypt.hash(newUser.password, salt, (err,hash)=>{
                        if(err) throw err;

                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.redirect('/login');
                            })
                             .catch(err => console.log(err))
                    }))
                }
            })
    }

});

router.post('/login' , (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/home',
        failureRedirect : '/login'
        
    })(req,res,next);
   
})

router.get('/login',(req,res)=>{
    res.render('login',{title:'Login'});
});

router.get('/register',(req,res)=>{
    res.render('register',{title:'Sign up'});
});

router.get('/logout' , (req,res)=>{
    req.logout();
    res.redirect('/login');
})

router.use('/home',require('./home.js'));


module.exports = router;