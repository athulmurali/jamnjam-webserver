const roles = require("../const/role");


const artistSchema  = require('../models/Artist');
const bandSchema    = require('../models/Band');
const adminSchema   = require('../models/Admin')
/* GET users listing. */
module.exports ={
    switchSchemaByRole  : (role)    =>{
    switch (role)
    {
        case roles.ADMIN : return adminSchema

        case roles.ARTIST :return artistSchema

        case roles.BAND :return bandSchema

        default : throw new Error("invalid role")
    }


},
    getModelsArray      : ()        => {
    const roleKeys = Object.keys(roles)
    console.log(roleKeys)
    return roleKeys.map(role => {return module.exports.switchSchemaByRole(roles[role])})
},

    getUserByField : async(fieldName, value) =>{
        try{
            const  userArray = await Promise.all(
                module.exports.getModelsArray().map(
                    userModel => {return userModel.findOne({[fieldName] : value}).exec()}))
            userArray.map(argument=>{})

            let currentUser = null;
            for(let i=0; i < userArray.length; i ++)
            {
                if(userArray[i])
                {
                    currentUser = userArray[i]
                    break;
                }
            }

            return currentUser;
        }
        catch(err){
            console.log(err)

        }

    }

}



