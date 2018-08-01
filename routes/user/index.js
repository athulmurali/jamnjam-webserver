var express = require('express');
var router = express.Router();

const switchSchemaByRole = require("../../middlewares/user").switchSchemaByRole;


router.get('/:userRole', function (req,res) {
    try{
        const userRole = req.params.userRole;
        const userModel = switchSchemaByRole(userRole);
        userModel.find({}).then(users=>{
            res.send(users);
        })
    }
    catch(err){
        console.error(err)
        res.status(403).send({error : "Invalid role"});
        next(error)
    }

});



module.exports = router;


