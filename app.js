const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const { render } = require('ejs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
var http = require('http');
var socketIO = require('socket.io');
const formatMessage = require('./utils/moment.js');


dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport);
const db = require('./config/key.js').MongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log("Connectd to MongoDB") })
    .catch(err => console.log(err));


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection : mongoose.connection})

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use('/', require('./routes/mainRouter.js'));

var server = http.Server(app);
server.listen(PORT);

var io = socketIO(server);
let users = {};
io.use(async (socket,next) => {
    const userID = socket.handshake.query.userid;
    const name = socket.handshake.query.name;
    if(!userID){
        return next(new Error("invalid username"));

    }
    users[userID] = socket.id;
    socket.userID = userID;
    socket.name = name;
    next();
})

io.on('connection' , (socket) => {
    console.log('SOCKET IO' + socket.id);
    
    socket.emit('message' , { message : `Welcome to chat ${socket.name}` , time: formatMessage().time});
    socket.on('private message' , ({content , to}) => {
        var toID = users[to];
        var time = formatMessage().time;
        socket.to(toID).emit("private message" , {
            content,
            from : socket.id,
            time : time
        });
    });


    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
      });

    socket.on('disconnect' , ()=>{
        io.emit('message' , {message : `${socket.name} has left the chat` , time : formatMessage().time});
    });



    



})