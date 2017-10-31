var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Book = require('./book.js');
var Schema =  mongoose.Schema;

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
    },
    addedBooks: [{
      type: Schema.Types.ObjectId, 
      ref: 'Book'
    }]
  }
});

//Will Add function to hash password and compare password later
var saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds)
UserSchema.methods.genHash = function(password){
  return bcrypt.hashSync(password, salt);
}

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
}

var User = module.exports = mongoose.model('user', UserSchema);