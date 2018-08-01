const roles = require('../const/role')

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

function UserSchema(add){
    var schema =   new Schema({
        username  :{
            type: String,
            required: true,
            unique : true
        },
        emailId  :{
            type: String,
            required: true,
            unique : true
        },
        googleId : String,
        password   :
            {
                type: String,
                required: true,
                unique : true
            },
        address: String,
        role: {
            type: String,
            enum : [roles.ADMIN, roles.ARTIST, roles.BAND],
            default: roles.ARTIST
        },
    })

    if(add) {
        schema.add(add);
    }


    schema.statics.isUsernameAvailable = function ( username, cb) {

        console.log("Gi")
        UserSchema.findOne({username : username}).
        then(result=>{
            if (result)
            {
                cb(null,false)
            }
            else {
                cb(null,true)
            }

        }).
        catch(err=>{
            cb(err, false)
        })
    }

    return schema;
};



module.exports= UserSchema;
