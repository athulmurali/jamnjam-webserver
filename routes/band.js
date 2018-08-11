var express = require('express');
const roles = require("../const/role");
var router = express.Router({mergeParams: true});

const switchSchemaByRole = require("../middlewares/user").switchSchemaByRole;

const bandModel = switchSchemaByRole(roles.BAND);
const artistModel = switchSchemaByRole(roles.ARTIST);


// called by Artist
router.post('/memberRequest', async function (req, res, next) {

    try{
        console.log(req.query)
        const artistUsername = req.query.username
        const band          = await  bandModel.findOne({username: 'linkinpark'}).exec()
        const artistToAdd   = await  artistModel.findOne({username: artistUsername}).exec()

        // const result = await  artistToAdd.approveBand();

        const result = await  band.addRequestFromArtist(artistToAdd._id)
        return res.send(result)
    }

    catch(error) {
        res.status(403).send({error : error.toString()})
    }
});

router.post('/acceptMemberRequest', async function (req, res, next) {

    try{
        console.log(req.query)
        const artistUsername = req.query.username
        const band          = await  bandModel.findOne({username: 'linkinpark'}).exec()
        const artistToAdd   = await  artistModel.findOne({username: artistUsername}).exec()

        // const result = await  artistToAdd.approveBand();

        const result = await  band.acceptMemberRequest(artistToAdd._id)
        return res.send(result)
    }

    catch(error) {
        res.status(403).send({error : error.toString()})
    }
});


router.delete('/memberRequest', async function (req, res, next) {

    try{
        console.log(req.query)
        const artistUsername = req.query.username
        const band          = await  bandModel.findOne({username: 'linkinpark'}).exec()
        const artistToRemove   = await  artistModel.findOne({username: artistUsername}).exec()

        // const result = await  artistToAdd.approveBand();

        const result = await  band.rejectMemberRequest(artistToRemove._id)
        return res.send(result)
    }
    catch(error) {
        res.status(403).send({error : error.toString()})
    }
});


//kickOut member
router.delete('/member', async function (req, res, next) {

    try{
        console.log(req.query)
        const artistUsername = req.query.username
        const band          = await  bandModel.findOne({username: 'linkinpark'}).exec()
        const artistToRemove   = await  artistModel.findOne({username: artistUsername}).exec()

        // const result = await  artistToAdd.approveBand();

        const result = await  band.removeMember(artistToRemove._id)
        return res.send(result)
    }
    catch(error) {
        res.status(403).send({error : error.toString()})
    }
});

module.exports = router;
