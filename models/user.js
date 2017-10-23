var mongoose = require('mongoose');
//Need bcryptjs for hashing password
var UserSchema =  mongoose.Schema({
  local: {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }
});

//Will Add function to hash password and compare password later

var User = module.exports = mongoose.model('user', UserSchema);