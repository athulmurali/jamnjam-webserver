const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')


passport.serializeUser((user,done)=>{
    done(null,user.id)
})


passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{

        done(null, user)

    })

})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_KEY,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('passport callback function fired:');
        console.log(profile);
        // check if user exists ?

        User.findOne({googleId: profile.id}).then((currentUser)=>{
            if(currentUser)
            {
                console.log("user already exists ! ");
                done(null,currentUser)
            }

            else{

                new User({
                    username : profile.displayName,
                    googleId: profile.id
                }).save().
                then((newUser)=>{
                    console.log("newUser created " )
                    console.log(newUser)
                    done(null,newUser)

                })

            }

        })

    })
);
