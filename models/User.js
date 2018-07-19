var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username : String,
    googleId : String
});

const User = mongoose.model('user', UserSchema);
module.exports= User;
