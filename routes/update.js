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

router.put('/user',   function (req,res,next) {

    const user = req.body;
    const userSchema = userUtils.switchSchemaByRole(user.role)
    console.log("attempting to update and save. ")
    console.log(user)

    userSchema.findByIdAndUpdate(
        user._id,
        user,
        {new: true}).
    then((data)=>{
        if (data)  return res.send(data)

        else return res.status(403).send({error : "No such user found!"})
    }).catch((err)=>{
        console.log("Error :...")
        console.log(err)
        res.status(409).send(err)
    })
})



module.exports = router;
