const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
const Teacher = require('../models/teacher.js');



router.post('/register', (req, res) => {
    console.log(req.body)
    var { name, email, password, confirm_password, Role, Latitude, Longitude } = req.body;



    let errors = [];

    if (!name || !email || !password || !confirm_password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== confirm_password) {
        errors.push({ msg: 'Password do not match' });
    }


    if (errors.length > 0) {
        res.render('register');
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    console.log('User already exist');
                    prompt('User already exist');
                    res.render('register');
                } else {
                    console.log("HELO" + Latitude)
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        latitude: req.body.Latitude,
                        longitude: req.body.Longitude,
                        role: req.body.radioProfession


                    })

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                if (req.body.radioProfession === 'Teacher') {
                                    const newTeacher = new Teacher({
                                        id:user, name: req.body.name, latitude: req.body.Latitude, longitude: req.body.Longitude
                                    });

                                    newTeacher.save().then(teacher => {
                                        res.redirect('/login');
                                    }).catch(err => console.log(err))
                                } else {
                                    res.redirect('/login');
                                }




                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login'

    })(req, res, next);

})

router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register', { title: 'Sign up' });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

router.use('/home', require('./home.js'));
router.use('/api',  require('./api.js')); 

module.exports = router;