const nodeMailer = require('nodemailer');


const transporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});


const mailOptions = {
    from: process.env.EMAIL_USERNAME, // sender address
    to: 'athulmurali@gmail.com', // list of receivers
    subject: 'test', // Subject line
    html: '<p>Your html here</p>'// plain text body
};


module.exports = {

    setMailOptions: (to, subject, message) => {

        return {

            from: process.env.EMAIL_USERNAME, // sender address
            to: to,
            subject: subject,
            html: `<p> ${message}</p>`// plain text body
        }

    },

    sendNewMail: (to, subject, message) => {
        return transporter.sendMail(module.exports.setMailOptions(to, subject, message),
            function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });

    },

    test: () => {
        return transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }
}
