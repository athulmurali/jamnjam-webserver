
const keys = require('./config/keys')



const mongoose = require('mongoose')


const passportSetup = require('./config/passport-setup')
const passport = require('passport')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var logger = require('morgan')



var app = express();


app.use(cookieSession({
    maxAge: 24*60*60*100,
    keys:["thisKeyIsTopSecret"]
}))

app.use(passport.initialize())
app.use(passport.initialize())


mongoose.connect(keys.mongo.url,{ useNewUrlParser: true } ,()=>{
  console.log("mongoose : connect success")
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));





var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');





app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);


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
  res.render('error');
});

module.exports = app;
