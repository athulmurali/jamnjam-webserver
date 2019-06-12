const models = require("../const/models")


const mongoose     = require('mongoose');


const ArtistLookOutStatus = Object.freeze({
    Open                : 'open',
    Done                : 'done',

});


const  ArtistLookOutSchema = new mongoose.Schema({

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: models.bandModel,
            required: true,
        },
        title: {
            required: true,
            type: String,
        },
        description: {
            required: true,
            type: String,
        },

        status: {
            type: String,
            default: ArtistLookOutStatus.Open,
            enum: Object.values(ArtistLookOutStatus),
        },

        createdAt: {
            type: Date,
            default: new Date()
        }

    }
)


    Object.assign(ArtistLookOutSchema.statics, {ArtistLookOutStatus});

ArtistLookOutSchema.methods.toJSON = function() {
        const obj = this.toObject();
        // delete obj.password;
        return obj;
    }




module.exports= mongoose.model(models.artistLookoutModel,ArtistLookOutSchema);
