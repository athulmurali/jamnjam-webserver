const jwt = require("jsonwebtoken");
const User = require('../models/User')
const getUserByField = require("./user").getUserByField;
const REQ_TOKEN_NAME = require("../const/jwt").REQ_TOKEN_NAME;

module.exports={
    validateToken : (req,res,next)=>{
        var token = req.headers[REQ_TOKEN_NAME];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, process.env.JWT_KEY,  function(err, decoded) {
            if (err) {
                console.log(err)
                return res.status(401).send({error : err.toString()})
            }
            else{
                req.decoded = decoded
               getUserByField({_id:decoded.id}).
                then((user)=>{
                    if(user)
                    {
                        console.log("user from token : ")
                        console.log(user)
                        req.user= user
                        next() }
                    else
                    {
                        err = new Error("JWT -  No such user")
                        return res.status(401).send({error : err.toString()})

                    }
                }).
                catch((err)=>{
                    // next(err);
                    return res.status(401).send({error : err.toString()})
                })
            }
        });
    }


}
