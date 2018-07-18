const keys = require('../config/keys')

var express = require('express');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { clientID: keys.google.clientID });
});



/* GET home page. */
router.get('/callback', function(req, res, next) {
    res.render('callback', { clientID: keys.google.clientID });
});



module.exports = router;
