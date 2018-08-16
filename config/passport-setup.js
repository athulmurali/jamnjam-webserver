const userSchema = require('../models/User')
const passport    = require('passport');
const passportJWT = require("passport-jwt");
const userUtils = require("../middlewares/user");
const configAuth = require("./auth");
const userRoles = require("../const/role");
const PASSWORD_FIELD = require("../const/jwt").PASSWORD_FIELD;
const USERNAME_FIELD = require("../const/jwt").USERNAME_FIELD;
const getUserByField = require("../middlewares/user").getUserByField;

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;



const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});




passport.use(
    new LocalStrategy({
        usernameField: USERNAME_FIELD,
        passwordField: PASSWORD_FIELD,
    },
    function (username, password, cb) {

        //Assume there is a DB module pproviding a global UserModel
        return getUserByField('username',username)
            .then(user => {

                if (!user)
                    return cb(null, false, {message: 'Incorrect usrname or password.'});

                user.comparePassword(password,(err,isMatch)=>{
                    if (err) {
                        console.log(err)
                        return cb(null, false, {message: err.toString()});
                    }
                    if (!isMatch) {
                        return cb(null, false, {message: 'Incorrect username or password.'});
                    }

                    return cb(null, user, {
                        message: 'Logged In Successfully'
                    });
                })


            })
            .catch(err => {
                return cb(err);
            });
    }
));




passport.use(

    new GoogleStrategy(
        {
            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     :  configAuth.googleAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            getUserByField( 'google.id' , profile.id ).
            then(()=>{

                if (user) {

                    // if a user is found, log them in
                    return done(null, user,{
                        message: 'Logged In Successfully'
                    });
                }
                else {
                    console.log("GoogleStrategy")

                    // if the user isnt in our database, create a new user
                    var newUser =  new userSchema()

                    // set all of the relevant information
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken


                    newUser.firstName = profile.givenName;
                    newUser.lastName  = profile.familyName;
                    newUser.password  = 'noPassword'
                    newUser.phone     = 1234567;
                    newUser.zip       = 1234567;
                    newUser.role      = userRoles.ARTIST
                    newUser.google.email = profile.email; // pull the first email

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
                })
            .catch(err=>{done(err)})

            });
}
    ));



passport.use(
    new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : process.env.JWT_KEY,
        },
        function (jwtPayload, cb) {
            console.log( jwtPayload.user)
            //find the user in db if needed
            const userSchema = userUtils.switchSchemaByRole(jwtPayload.user.role)

            return userSchema.findById(jwtPayload.user._id)
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ));
