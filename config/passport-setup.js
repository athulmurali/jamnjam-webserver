const roles = require("../const/role");

const passport    = require('passport');
const passportJWT = require("passport-jwt");
const userUtils = require("../middlewares/user");
const PASSWORD_FIELD = require("../const/jwt").PASSWORD_FIELD;
const USERNAME_FIELD = require("../const/jwt").USERNAME_FIELD;
const getUserByField = require("../middlewares/user").getUserByField;
const switchSchemaByRole = require("../middlewares/user").switchSchemaByRole;

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

passport.use(
    new LocalStrategy({
        usernameField: USERNAME_FIELD,
        passwordField: PASSWORD_FIELD,
    },
    function (username, password, cb) {

        //Assume there is a DB module pproviding a global UserModel
        return getUserByField('username',username)
            .then(user => {

                if (!user) return cb(null, false, {message: 'Incorrect usrname or password.'});

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
