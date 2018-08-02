var express = require('express');
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

module.exports = router;


