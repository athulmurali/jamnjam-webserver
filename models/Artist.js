var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var UserSchema  = require('./User')

const models     = require('../const/models')



var artistSchema = UserSchema({
    memberOf: {
            type: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: models.bandModel
                }]
            ,
            default : []


        }
});


module.exports= mongoose.model(models.artistModel,artistSchema);

