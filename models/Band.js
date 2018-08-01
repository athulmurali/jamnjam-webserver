var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var UserSchema  = require('./User')

const models     = require('../const/models')



var bandSchema = UserSchema({
    members: [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref : models.artistModel
        }
    ],

    gigs : [{type: Object}]

        });


module.exports = mongoose.model(models.bandModel,bandSchema)

