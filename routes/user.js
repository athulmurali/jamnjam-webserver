var express = require('express');
var router = express.Router();

const userUtils = require('../middlewares/user')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



router.post('/', function (req,res) {

    console.log(req.body)

    const user = req.body;

    const userSchema = userUtils.switchSchemaByRole(user.role)

    return new userSchema(user).save().
    then( savedObj=> {
        res.send(savedObj);
        return;
    }).
    catch(err => { res.status(403).send(err);})

});


// router.use('/user', userRole)




module.exports = router;
