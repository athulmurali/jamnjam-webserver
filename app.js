
console.log(process.env.JWT_KEY)

const mongoose = require('mongoose')


var express = require('express');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// const passportSetup = require('./config/passport-setup')
const passport = require('passport')


var path = require('path');
var cookieSession = require('cookie-session');

var logger = require('morgan')



//
// app.use(cookieSession({
//     maxAge: 24*60*60*100,
//     keys:["thisKeyIsTopSecret"]
// }))
//
// app.use(passport.initialize())
// app.use(passport.initialize())


mongoose.connect(
    process.env.MONGO_URL
    ,{ useNewUrlParser: true }).then(result=>{
    console.log("mongoose connect success !")
}).catch(error=>{
    console.log("error in mongoose connection")
    console.error(error);
})

//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


app.use(logger('dev'));





var authRouter          =     require('./routes/auth');
var indexRouter   =     require('./routes/index');
var userRouter   =      require('./routes/user');
var userRoleRouter   =   require('./routes/user/');

var usersRouter   =   require('./routes/users');


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/users/', usersRouter);

app.use('/user/:userRole', userRoleRouter);


app.use('/auth', authRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
    console.log(req)
    res.status(404).send({user : "Route not configured!"})
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 404).send('error');
// });

module.exports = app;
