var express = require('express');
const userUtils = require("../../middlewares/user");
var router = express.Router({mergeParams: true});

const switchSchemaByRole = require("../../middlewares/user").switchSchemaByRole;


router.delete('/:_id', function (req,res, next) {


    try {
        const userRole      = req.params.userRole;
        const userModel     = switchSchemaByRole(userRole);
        const _id           = req.params._id;
        userModel.findByIdAndDelete(_id).
        then(deletedUser => {
            if(deletedUser)
            {
                return res.send(deletedUser);

            }
            return res.status(404).send({error : "No user found to delete"})
        }).
        catch(err=>console.log(err))
    }
    catch (err) {
        console.log("error..")
        // console.error(err)
        res.status(403).send({error: "Invalid role"});
        next(error)
    }

});


router.get('/isUserNameAvailable/:username',function (req,res) {

    console.log("username check: " + req.params.username)

    const userSchema = userUtils.switchSchemaByRole(req.params.userRole)

    userSchema.findOne({username: req.params.username}).then(user=>{
        if(user){
            return res.status(409).send({error : "Already taken!"})

        }
        else{
            return res.send({message : "available"})
        }
    })

})



router.get('/isEmailAvailable/:email',function (req,res) {

    console.log("email check: " + req.params.email)

    const userSchema = userUtils.switchSchemaByRole(req.params.userRole)

    userSchema.findOne({emailId: req.params.email}).then(user=>{
        if(user){
            return res.status(409).send({error : "Already taken!"})

        }
        else{
            return res.send({message : "available"})
        }
    })

})

module.exports = router;


