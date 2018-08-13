var express = require('express');
const roles = require("../const/role");
var router = express.Router({mergeParams: true});

const switchSchemaByRole = require("../middlewares/user").switchSchemaByRole;

const bandModel = switchSchemaByRole(roles.BAND);
const artistModel = switchSchemaByRole(roles.ARTIST);



router.post('/band', async function (req, res, next) {

    try{
        console.log(req.query)

        const artistId = req.query.artistId
        const bandId = req.query.bandId

        const band          = await  bandModel.findById(bandId).exec()
        const artist        = await  artistModel.findById(artistId).exec()

        // const result = await  artistToAdd.approveBand();

        const bandResult = await  band.addArtistIdToBand(artistId);
        const artistResult = await artist.addBandIdToMemberOfList(bandId);


        return res.send(artistResult)
    }
    catch(error) {
        res.status(403).send({error : error.toString()})
    }
});



//LEave  band
router.delete('/band', async function (req, res, next) {

    try{
        console.log(req.query)

        const artistId = req.query.artistId
        const bandId = req.query.bandId

        const bandToLeave          = await  bandModel.findById(bandId).exec()
        const artist               = await  artistModel.findById(artistId).exec()

        // const result = await  artistToAdd.approveBand();

        const result = await  artist.leaveBand(bandToLeave._id)
        const bandResult = await  bandToLeave.removeMember(artistId)
        return res.send(result)
    }
    catch(error) {
        res.status(403).send({error : error.toString()})
    }
});



module.exports = router;


//
// // called by Band
// router.post('/addRequestFromBand', async function (req, res, next) {
//
//     try{
//         console.log(req.query)
//
//         const artistId = req.query.artistId
//         const bandId = req.query.bandId
//
//         const bandToAdd         = await  bandModel.findById(bandId).exec()
//         const artist   = await  artistModel.findById(artistId).exec()
//
//
//         const result = await artist.addRequest(bandToAdd._id)
//
//         return res.send(result)
//     }
//
//     catch(error) {
//         res.status(403).send({error : error.toString()})
//     }
// });
//
// router.post('/acceptBand', async function (req, res, next) {
//
//     try{
//
//         console.log(req.query)
//
//
//         const artistId = req.query.artistId
//         const bandId = req.query.bandId
//
//         const bandToAdd         = await  bandModel.findById(bandId).exec()
//         const artist   = await  artistModel.findById(artistId).exec()
//         // const result = await  artistToAdd.approveBand();
//
//         const result = await  artist.acceptMemberRequest(bandToAdd._id)
//         return res.send(result)
//     }
//
//     catch(error) {
//         res.status(403).send({error : error.toString()})
//     }
// });
//
//
// router.delete('/bandRequest', async function (req, res, next) {
//
//     try{
//         console.log(req.query)
//
//         const artistId = req.query.artistId
//         const bandId = req.query.bandId
//
//         const artist          = await  bandModel.findById(bandId).exec()
//         const bandToRemove  = await  artistModel.findById(artistId).exec()
//         // const result = await  artistToAdd.approveBand();
//
//         const result = await  artist.rejectRequestFromBand(bandToRemove._id)
//         return res.send(result)
//     }
//     catch(error) {
//         res.status(403).send({error : error.toString()})
//     }
// });
