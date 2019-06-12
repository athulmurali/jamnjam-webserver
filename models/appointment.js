const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    title: { type: String, required: 'Appointment description is required' },
    user: {
        id: { type: String, required: true },
        displayName: String
    },
    dateAndTime: { type: Date, required: true },
    endDateAndTime: { type: Date, required: true },
    remarks: String,
    with: {
        type: mongoose.Schema.Types.ObjectId
    },

});

AppointmentSchema.virtual('duration')
    .get(function () {
        const durationMs = this.endDateAndTime - this.dateAndTime;
        if (durationMs) {
            return Math.abs(this.endDateAndTime - this.dateAndTime) / 1000 / 60;
        }
        else {
            return;
        }
    });

AppointmentSchema.path('dateAndTime').validate(
    async function (value) {

        const self = this;
        console.log("AppointmentSchema")
        console.log(value)
        try
        {
            const docs =
                await mongoose.models.Appointment.find({
                    '_id': {$ne: self._id},
                    'user.id': self.user.id,
                    $or: [
                        {dateAndTime: {$lt: self.endDateAndTime, $gte: self.dateAndTime}},
                        {endDateAndTime: {$lte: self.endDateAndTime, $gt: self.dateAndTime}}
                    ]
                });
            console.log(docs)

            return (!docs || docs.length === 0);

        }
        catch (err){
            console.log(err)
            return false
        }

    }, "The appointment overlaps with other appointments");

AppointmentSchema.path('dateAndTime').validate(function (value) {
    let isValid = true;
    if (value < new Date()) {
        isValid = false;
    }
    return isValid;
},
    "The appointment can not be scheduled in the past");




module.exports = mongoose.model('Appointment', AppointmentSchema);
