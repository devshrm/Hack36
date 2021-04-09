const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const { render } = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');

dotenv.config({path : './config/config.env'});

require('./config/passport')(passport);
const db=require('./config/key.js').MongoURI;
mongoose.connect(db,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{console.log("Connectd to MongoDB")})
    .catch(err=>console.log(err));


const app = express();
const PORT = process.env.PORT||3000;

app.use(morgan('dev'));

app.set('view engine' , 'ejs');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,"public")));

app.use('/' , require('./routes/mainRouter.js'));

app.listen(PORT, ()=>{
    console.log('Connected');
})