
var sanitizer = require('sanitizer');



exports.sanitizeRequestBody = function (req, res, next) {
    if (req.body) {
        for (var prop in req.body) {
            if (typeof req.body[prop] === 'string') {
                req.body[prop] = sanitizer.sanitize(req.body[prop]);
            }
        }
    }
    next();
};
