var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var passport = require('passport')
var authenticate = require('./authenticate')
var jwt = require('jsonwebtoken')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var todoRouter = require('./routes/todos')

const mongoose = require('mongoose')

const ToDo = require('./models/todos')

// connect to mongodb server
const URL =" mongodb+srv://pal:todoapp@cluster0.ym1ek.gcp.mongodb.net/toDo?retryWrites=true&w=majority" ||'mongodb://localhost:27017/toDo'
const connect = mongoose.connect(URL)

connect.then(db => { // connect promise 
  console.log('Connected to db server')
}, err => console.log(err))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/',express.static(path.join(__dirname,'angular')))
// app.use(cookieParser());

// create express session 
app.use(session({
  name: 'session-id',
  secret: 'Shhh! its secret',
  saveUninitialized: false,
  resave: false,
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())


// app.use('/',indexRouter)

app.use('/users',usersRouter)

app.use('/angular',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'angular','index.html'))
})


function auth(req,res,next){
  try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'Shh!! This is secret!')
    // console.log(decodedToken);
    req.userData = {username: decodedToken.username, 
                    userId: decodedToken.userId}
    next()
  }
  catch(error){
      res.status(401).json({message: 'Auth failed!'})
  }
}

app.use(auth) // auth middleware to make sure authentication

app.use(express.static(path.join(__dirname, 'public')));

// routers here  
app.use('/todos',todoRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
