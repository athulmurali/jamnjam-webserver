const roles = require('../const/role')

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

const   bcrypt = require('bcrypt');
const   SALT_WORK_FACTOR = 10;



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
        google :{
            id : String,
            token : String

        },
        password   :
            {
                type: String,
                required: [true, 'password is required']
            },
        zip: Number,
        role: {
            type: String,
            enum : [roles.ADMIN, roles.ARTIST, roles.BAND],
            default: roles.ARTIST
        },
        bio: {
            type : String,
            default: ''
        },
        img : {
            type : String,
            default : ''
        }
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


    schema.pre('save', function(next) {
        var user = this;

        console.log("'in pre save hook ....")
        console.log(user)

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password'))

        {
            console.log("No change in password")
            return next();
        }

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

            console.log("change in password observed")
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });



    schema.pre('update', function(next) {
        var user = this;

        console.log("'in pre update hook ........")
        console.log(user)

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password'))

        {
            console.log("No change in password")
            return next();
        }

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

            console.log("change in password observed")
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });




    schema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    schema.methods.toJSON = function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    }

    return schema;
};



module.exports= UserSchema;
