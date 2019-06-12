const express = require('express');

const  index = require('./appointments/index');

const appointments = require('./appointments/appointments');
const middleware = require("../middlewares/santizer");
const router = express.Router();



// Index
router.get('/', index.index);



// Appointments
router.route('/appointments')

    .get(appointments.getByUser)
    .post(middleware.sanitizeRequestBody, appointments.create);

router.route('/appointments/:id')
    .get(appointments.getById)
    .put(middleware.sanitizeRequestBody, appointments.update)
    .patch(middleware.sanitizeRequestBody, appointments.update)
    .delete(appointments.delete);

// --
module.exports = router;
