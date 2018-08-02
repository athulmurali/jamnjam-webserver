const roles = require("../const/role");


const artistSchema  = require('../models/Artist');
const bandSchema    = require('../models/Band');
const adminSchema   = require('../models/Admin')
/* GET users listing. */
module.exports ={
 switchSchemaByRole  : (role) =>{
    switch (role)
    {
        case roles.ADMIN : return adminSchema


        case roles.ARTIST :return artistSchema

        case roles.BAND :return bandSchema

        default : throw new Error("invalid role")
    }

}

}
