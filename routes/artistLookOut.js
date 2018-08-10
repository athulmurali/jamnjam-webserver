const models = require( "../const/models")
const mongoose = require( 'mongoose')

var express = require('express');

const ArtistLookOutSchema = require('../models/ArtistLookout')

var router = express.Router();



/* GET artistLookOut. */
router.get('/:artistLookOutId', function(req, res, next) {
    console.log("artistLookoutId ")
    const artistLookOutId = req.params.artistLookOutId;
    console.log(artistLookOutId)

    mongoose.model(models.artistLookoutModel).findById(artistLookOutId).then(
        (data)=>res.send(data)
    ).catch(err=>{
        res.send(err);
    })

});



/* GET all docs-  artistLookOut. */
router.get('/', function(req, res, next) {
    console.log("artistLookoutId ")
    const artistLookOutId = req.params.artistLookOutId;
    console.log(artistLookOutId)

    mongoose.model(models.artistLookoutModel).find({}).then(
        (data)=>res.send(data)
    ).catch(err=>{
        res.send(err);
    })

});


router.post('/', function(req, res, next) {

    console.log("Printing req body to add artistLookOut : ")
    new ArtistLookOutSchema(req.body).save().then(
        data=>{
            res.send(data)
        },
        err=>{
            res.status(409).send(err)
        }
    )

});


// find and remove based on the

router.delete('/:artistLookOutId', function(req, res, next) {

    mongoose.model(models.artistLookoutModel).findByIdAndRemove(req.params.artistLookOutId).
    then((data)=>{
            if (data)  return res.send(data)

                else return res.status(403).send({error : "No such artistLookOut found!"})
        }).
    catch(err=>{
            return res.status(403).send(err)
        })

});



router.put('/', function(req, res, next) {
    mongoose.model(models.artistLookoutModel).findByIdAndUpdate(
        req.body._id,
        req.body,
        {new: true}).
    then((data)=>{
        if (data)  return res.send(data)

        else return res.status(403).send({error : "No such artistLookOut found!"})
    }).
    catch(err=>{
        return res.status(403).send(err)
    })

});

// router.put('/', function(req, res, next) {
//     console.log("Printing req body to add artistLookOut : ")
//     console.log(req.body)
//     res.send({message : "hello!"});
//
// });


module.exports = router;
