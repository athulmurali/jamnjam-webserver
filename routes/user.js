var express = require('express');
var router = express.Router({mergeParams: true});
const userUtils = require('../middlewares/user')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const getUserByField = require("../middlewares/user").getUserByField;

const passport = require('passport')
require('../config/passport-setup')
const BAND = require("../const/role").BAND;
const ARTIST = require("../const/role").ARTIST;
const switchSchemaByRole = require("../middlewares/user").switchSchemaByRole;

router.post('/',   function (req,res,next) {

    const user = req.body;
    const userSchema = userUtils.switchSchemaByRole(user.role)
    console.log("attempting to create new user and save. ")
    console.log(user)
    new userSchema(user).save().
    then((newUser) => {
        console.log("newUser created ")
        console.log(newUser)
        // res.send(newUser);

        var token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, {
            expiresIn: 24*60*60*1000 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
        // res.send(user)


    }).catch((err)=>{
        console.log("Error :...")
        console.log(err)
        res.status(409).send(err)
    })
})



router.delete('/:_id', function (req,res) {
    try{
        const user_id = req.params._id;
        mongoose.models.remove({_id:user_id}).then(removedUser=>{
            res.send(removedUser);
        })
    }
    catch(err){
        console.error(err)
        res.status(403).send(err);
        next(error)
    }

});

// /api/login
// Finds the user in the mongo database and logs them in
router.post('/login', async (req, res, next) => {
    try{
        console.log("Current path:  " + req.originalUrl)
        console.log(req.body)
        const username = req.body.username;
        const password = req.body.password;
        const user = await getUserByField('username', username)
        if(user)
        {
            user.comparePassword(password,
                (err,isMatch)=> {
                    if(err) throw err;
                    if(isMatch) res.send(user)
                    else res.status(403).send({error : "Invalid user name or password"})
                })
        }
        else res.status(401).send({error : "Invalid user name or password"})
    }
    catch (err){
        res.status(401).send(err)
    }})


// the following is an array.
// Each user collection returns a doc or null
// once a non null doc is found we return that




router.get('/profile' , passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {

    console.log(req)

    try{

        const userModel = switchSchemaByRole(req.user.role);
        let result = null;
        const user = req.user;
        if (user.role === ARTIST)
        {

            result = await userModel.findById(req.user._id)
                .populate('memberOf').exec()

            res.send(result)
        }


        else if (user.role === BAND)
        {

            result = await userModel.findById(user._id)
                .populate('members').exec()

            res.send(result)
        }

        else{
            res.send(req.user);

        }
    }


    catch(err){
        res.status(403).send(err)
    }

    })



module.exports = router;
