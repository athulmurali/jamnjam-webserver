var mongoose     = require('mongoose');
var UserSchema  = require('./User')

const models     = require('../const/models')



var bandSchema = UserSchema({


    title : {

        type: String,
        required : true
    },
    members: [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref : models.artistModel
        }
    ],

    // people willing to join a band will request to be added
    // this array represents those
    memberRequest: [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref : models.artistModel
        }
    ],


    gigs : [{type: Object}]

        });


bandSchema.methods.approveBandMemberRequest= function (bandId) {



    return "jhi"


}



bandSchema.methods.sendRequestToArtist= function(artistId){


    return new Promise((resolve,reject) =>{


        if(this.members.indexOf(artistId) > -1 )
            reject('Already artistId already in members list')
        if(this.memberRequest.indexOf(artistId) > -1 )
            reject('Already artistId already in members to approve list! Approve or cancel it first')

        this.members.push(artistId)
        this.save().then(
            savedUser => resolve(savedUser)
        ).catch(
          err=>  reject(err)
        )

    } )

}



//promise
// resolves if saved successfully
// rejects if any validation error occurs


// to be called by artistModel
bandSchema.methods.addRequestFromArtist= function(artistId){


    return new Promise((resolve,reject) =>{


        if(this.members.indexOf(artistId) > -1 )
            reject('Already artistId already in members list')
        else if(this.memberRequest.indexOf(artistId) > -1 )
            reject('Already artistId already in members to approve list! Approve or cancel it first')

        else {
            this.memberRequest.push(artistId)
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }

    } )



}

bandSchema.methods.removeMember= function(artistId){
    return new Promise((resolve,reject) =>{


        if(this.members.indexOf(artistId) === -1 )
            reject('The aritstId doesnt exist')

        else{

            let array = this.members
            array.splice(array.indexOf(artistId), 1);

            this.members = array
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }



    } )
}


bandSchema.methods.acceptMemberRequest= function(artistId){
    return new Promise((resolve,reject) =>{

        if(this.members.indexOf(artistId) > -1 )
            reject('Already artistId already in members list')
        else if(this.memberRequest.indexOf(artistId) === -1 )
            reject('Member artistId not found in requests')

        else {
            let array = this.memberRequest
            array.splice(this.memberRequest.indexOf(artistId),1)

            this.memberRequest = array;
            console.log(array)
            this.members.push(artistId)

            this.save().
            then(savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }

    } )
}



bandSchema.methods.rejectMemberRequest= function(artistId){
    return new Promise((resolve,reject) =>{


        if(this.memberRequest.indexOf(artistId) === -1 )
            reject('The aritstId does not exist in requests. Cannot reject a request which is not sent')

        else{

            let array = this.memberRequest
            array.splice(array.indexOf(artistId), 1);

            this.memberRequest = array
            this.save().then(
                savedUser => resolve(savedUser)).
            catch(err=>  reject(err))

        }



    } )
}






module.exports = mongoose.model(models.bandModel,bandSchema)

