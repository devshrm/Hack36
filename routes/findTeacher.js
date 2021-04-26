const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Teacher = require('../models/teacher.js');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    Teacher.find().sort({ createdAt: -1 }).populate('id').exec((err , result) => {
       
        res.render('findTeacher', { title: 'Find teacher', teacher: result });
    })

});

router.get('/map', (req, res) => {
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

module.exports = router;