const express = require('express');
const router  = express.Router();

const jwt      = require('jsonwebtoken');
const passport = require('passport');
const userUtils = require("../middlewares/user");
const EXPIRY_TIME = require("../const/jwt").EXPIRY_TIME;


/* POST login. */
router.post('/login', function (req, res, next) {

    console.log("auth login reached")
    passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log(err);
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }


            var token = jwt.sign({
                user :  user.toObject()

            }, process.env.JWT_KEY, {
                expiresIn: EXPIRY_TIME
            });

            return res.send({user, token});
        })})
    (req, res);

});


// router.post('/googleLogin', function (req, res, next) {
//
//     console.log("google auth  login reached")
//
//
//         if ( !req.body) {
//             return res.status(400).json({
//                 message: info ? info.message : 'Login failed',
//                 user   : user
//             });
//         }
//
//         req.login(user, {session: false}, (err) => {
//             if (err) {
//                 res.send(err);
//             }
//
//
//             var token = jwt.sign({
//                 user :  user.toObject()
//
//             }, process.env.JWT_KEY, {
//                 expiresIn: EXPIRY_TIME
//             });
//
//             return res.send({user, token});
//         })})
//         (req, res);
//
// });


module.exports = router;

