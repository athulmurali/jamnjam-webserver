const mongoose     = require('mongoose');
const UserSchema  = require('./User')

const models     = require('../const/models')



const adminSchema = UserSchema({

    firstName : {
        type : String,
        required : true
    },


    lastName : {
        type : String,
        required : true

    },

    isAdmin : {
        type: Boolean,
        default: true
    }
});

adminSchema.pre('save', function(next) {
    const user = this;
    console.log("Sdgsdgs")
    console.log(user)
    next();
});



module.exports=  mongoose.model(models.adminModel,adminSchema);
