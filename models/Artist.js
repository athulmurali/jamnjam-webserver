
var mongoose     = require('mongoose');
const roles = require("../const/role");
var UserSchema  = require('./User')

const models     = require('../const/models')
const switchSchemaByRole = require("../middlewares/user").switchSchemaByRole;



const artistSchema = UserSchema({

    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    memberOf: {
            type: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: models.bandModel
                }]
            ,
            default : []


        },
    memberOfRequests :{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: models.bandModel
        }]
        ,
        default : []
    },

});

// to be called by artistModel
artistSchema.methods.addRequest= function(bandId){
    return new Promise((resolve,reject) =>{


        if(this.memberOf.indexOf(bandId) > -1 )
            reject('Already artist present in band')
        else if(this.memberOfRequests.indexOf(bandId) > -1 )
            reject('Already artist present in memberOfRequests')

        else {
            this.memberOfRequests.push(bandId)
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }

    } )
}



artistSchema.methods.addBandIdToMemberOfList= function(bandId){
    return new Promise((resolve,reject) =>{


        if(this.memberOf.indexOf(bandId) > -1 )
            reject('Already artist present in band')
        else if(this.memberOfRequests.indexOf(bandId) > -1 )
            reject('Already artist present in memberOfRequests')

        else {
            this.memberOf.push(bandId)
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }

    } )
}


artistSchema.methods.leaveBand= function(bandId){
    return new Promise((resolve,reject) =>{

        if(this.memberOf.indexOf(bandId) === -1 )
            reject('The aritstId doesnt exist')

        else{
            let array = this.memberOf
            array.splice(array.indexOf(bandId), 1);
            this.memberOf = array
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))
        }
    } )
}


artistSchema.methods.acceptRequestFromBand= function(bandId){
    return new Promise((resolve,reject) =>{
        if(this.memberOf.indexOf(bandId) > -1 )
            reject('Already bandId present in memberOf  list')
        else if(this.memberRequest.indexOf(bandId) === -1 )
            reject('Member bandId not found in requests')
        else {
            let array = this.memberOfRequests
            array.splice(this.memberOfRequests.indexOf(bandId),1)

            this.memberOfRequests = array;
            this.memberOf.push(bandId)

            this.save().
            then(savedUser => resolve(savedUser)).
            catch(err=>  reject(err))
        }
    } )
}



artistSchema.methods.rejectRequestFromBand= function(bandId){
    return new Promise((resolve,reject) =>{


        if(this.memberOfRequests.indexOf(bandId) === -1 )
            reject('The aritstId does not exist in requests. Cannot reject a request which is not sent')

        else{

            let array = this.memberOfRequests
            array.splice(array.indexOf(bandId), 1);

            this.memberOfRequests = array
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }



    } )
}


artistSchema.pre('remove',function(next){
    console.log("Pre remove - artist ")
    const artist = this;
    this.memberOf.map((bandId)=>{

    switchSchemaByRole(roles.BAND).findById(bandId).then((bandUser)=>{
            if(bandUser)
            {
                console.log("bandUser found! ")
                bandUser.removeMember((artist._id) , (result)=>{
                    if(result)
                    {
                        console.log("removed artist id from band members: " + artist._id)
                        console.log(result)
                    }
                })
            }
            return null;
        })

    })

    next();
})





module.exports= mongoose.model(models.artistModel,artistSchema);

