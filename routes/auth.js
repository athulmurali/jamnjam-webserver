const router = require('express').Router();

const passport = require('passport');
const User = require('../models/User')


// auth login
router.get('/login',  (req, res)=> {
      // res.send('login', { user: req.user });
    res.send('logging in');

});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google+
router.get('/google',
    passport.authenticate("google", {scope:['profile']})
);


// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect',
    passport.authenticate("google"),
    (req, res) => {
    res.send('you reached the redirect URI');
});



router.post('/signup', (req, res) => {
    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ 'local.username': username }, (err, userMatch) => {
        if (userMatch) {
            return res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        const newUser = new User({
            'local.username': username,
            'local.password': password
        })
        newUser.save((err, savedUser) => {
            if (err) return res.json(err)
            return res.json(savedUser)
        })
    })
})




function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}



module.exports = router;
