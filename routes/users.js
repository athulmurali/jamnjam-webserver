var express = require('express');
var router = express.Router();
const roles = require("../const/role");


const artistSchema  = require('../models/Artist');
const bandSchema    = require('../models/Band');
const adminSchema   = require('../models/Admin')
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', function(req, res, next) {

    const admins =          adminSchema.find({}).exec();
    const artists =        artistSchema.find({}).exec();
    const bands =          bandSchema.find({}).exec();


    // bandSchema.find({}).then(data=>console.log(data));


    Promise.all([admins, artists, bands])
        .then(([admins, artists, bands])=>{
            res.send({admins, artists, bands});}).
    catch(error=>{
        next(error);
        res.status(403).send(error);

    })
});

module.exports = router;
