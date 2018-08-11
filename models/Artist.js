var mongoose     = require('mongoose');
var UserSchema  = require('./User')

const models     = require('../const/models')



const artistSchema = UserSchema({

    firstName : {
        type : String,
    },
    lastName : {
        type : String,
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








module.exports= mongoose.model(models.artistModel,artistSchema);

