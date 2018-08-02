var express = require('express');
var router = express.Router();

const userUtils = require('../middlewares/user')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const switchSchemaByRole = require("../middlewares/user").switchSchemaByRole;
const validateToken = require("../middlewares/auth").validateToken;



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
        res.status(403).send(error);
        next(error)
    }

});


module.exports = router;
