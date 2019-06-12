const Appointment = require('../../models/appointment');
const ARTIST = require("../../const/role").ARTIST;

function mapAppointment(dbAppointment) {
    const halAppointment = {
        _links: {
            self: { href: '/appointments/' + dbAppointment.id },
            user: { href: '/users/' + dbAppointment.user.id, title: dbAppointment.user.displayName }
        },
        id: dbAppointment.id,
        title: dbAppointment.title,
        dateAndTime: dbAppointment.dateAndTime,
        endDateAndTime: dbAppointment.endDateAndTime,
        duration: dbAppointment.duration,
        remarks: dbAppointment.remarks,
        with : dbAppointment.with
    };
    return halAppointment;
}

exports.create = function (req, res) {
    const newAppointment = new Appointment(req.body);
    newAppointment.user.id = req.user.id;
    newAppointment.user.displayName = req.user.displayName;
    newAppointment.save(function (err, savedAppointment) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(400).send(err);
            }
            return;
        }
        res.set('Location', '/appointments/' + savedAppointment.id);
        res.status(201).send(mapAppointment(savedAppointment));
    });
};

exports.getById = function (req, res) {
    const appointmentId = req.params.id;
    Appointment.find({id: appointmentId}, function(err, dbAppointment) {
        if (err) {
            throw err;
        }
        if (dbAppointment === null) {
            res.status(404).send({ message: 'Appointment can not be found' });
        }
        else {
            res.status(200).send(dbAppointment);
        }
    });
};

exports.getByUser = function (req, res) {


    console.log("User request after authentication")
    console.log(req.user)
    const result = {
        _links: {
            self: { href: '/appointments' }
        },
        _embedded: {
            appointment: []
        },
        count: 0
    };

    const     fieldToSearch   = 'user.id';
    const     userId          = req.user.id;

    if(req.user.role ===  ARTIST)
        fieldToSearch= 'with'

    Appointment
        .find({ [fieldToSearch]: userId })
        .sort('-dateAndTime')
        .exec(function (err, appointments) {
            if (err) {
                throw err;
            }
            result.count = appointments.length;
            for (const i = 0; i < result.count; i++) {
                result._embedded.appointment.push(mapAppointment(appointments[i]));
            }
            res.status(200).send(result);
        });
};

exports.update = function (req, res) {
    const appointmentId = req.params.id;
    Appointment.findById(appointmentId, function(err, dbAppointment) {
        if (err) {
            throw err;
        }
        if (dbAppointment === null) {
            res.status(404).send({ message: 'Appointment can not be found' });
        }
        else {
            // maybe we should add a check for a complete object in case of a PUT request?
            dbAppointment.set(req.body) // updated object values from request body.
            dbAppointment.save(function (err, updatedDbAppointment) {
                if (err) {
                    if (err.name === 'ValidationError') {
                        res.status(422).send(err);
                    }
                    else {
                        res.status(400).send(err);
                    }
                    return;
                }
                res.status(200).send(mapAppointment(updatedDbAppointment));
            })
        }
    });
};

exports.delete = function (req, res) {
    const appointmentId = req.params.id;
    Appointment.findById(appointmentId, function(err, dbAppointment) {
        if (err) {
            throw err;
        }
        if (dbAppointment === null) {
            res.status(404).send({ message: 'Appointment can not be found' });
        }
        else {
            dbAppointment.remove(function (err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.status(200).send({ message: 'Appointment deleted' } );
            })
        }
    });
};
