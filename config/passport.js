
//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
module.exports = function(passport){
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
      done(err, user);
    })
  });

  //Sign Up Strategy
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.email': email}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, false, req.flash('signupMessage', 'That email already taken'));
        } else {
          var newUser = new User();
         // newUser.local.username = username;
          newUser.local.username = req.body.username;
          newUser.local.email = email;
          newUser.local.password = newUser.genHash(password);
          //newUser.local.password = password
          newUser.save(function(err){
            if(err){
              throw err;
            }
            return done(null, newUser);
          })
        }
      })
    })
  }));

  //Login Strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.email': email}, function(err, user){
        if(err){
          return done(err);
        }
        if(!user){
          return done(null, false, req.flash('loginMessage', 'No User Found'));
        } 
        if(!user.validPassword(password)){
          return done(null, false, req.flash('loginMessage', 'Invalid Password'));
        }
        return done(null, user);
      });
    })
  }));
}