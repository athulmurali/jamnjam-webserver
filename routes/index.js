const express = require('express');
const router = express.Router();
const passport = require('passport');


const helloRouter = require('./hello');
const authRouter = require('./auth');
const userRouter = require('./user');
const bandRouter = require('./band');
const userRoleRouter = require('./user/');
const usersRouter = require('./users');
const updateUserRouter = require('./update');
const artistRouter = require('./artist');
const artistLookOutRouter = require('./artistLookOut');


router.use('/', helloRouter);
router.use('/user', userRouter);
router.use('/user/:userRole', userRoleRouter);
router.use('/users/', usersRouter);
router.use('/band/', bandRouter);
router.use('/auth', authRouter);
router.use('/artistLookOut', artistLookOutRouter);
router.use('/update', updateUserRouter);
router.use('/artist/', artistRouter)

const appointmentRoutes = require('./routes');
router.use('/appointmentsApp', passport.authenticate('jwt', {session: false}), appointmentRoutes);

// catch 404 and forward to error handler
router.use(function (req, res, next) {
    // next(createError(404));
    res.status(404).send({user: "Route not configured!"})
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({message: "hello!"});

});


module.exports = router;
