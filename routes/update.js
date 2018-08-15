var express = require('express');
var router = express.Router({mergeParams: true});
const userUtils = require('../middlewares/user')

require('../config/passport-setup')



router.put('/user',   async function (req, res, next) {

    try{
        const user = req.body;
        const userSchema = userUtils.switchSchemaByRole(user.role)
        console.log("attempting to update and save. ")
        console.log(user)

        const currentUser = await userSchema.findById(user._id)
        if (!currentUser) {
            return res.status(403).send({error: "No such user found!"})

        }

        currentUser.set(user)
        const updatedUser = await currentUser.save();

        console.log(updatedUser)
        res.send(updatedUser)

    }
    catch(err){
        console.log(err.toString())
        return res.status.send({error : err.toString()})
    }

})


module.exports = router;
