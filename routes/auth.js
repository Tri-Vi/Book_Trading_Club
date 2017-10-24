var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res){
  res.send('hello from auth')
});
//Sign up
router.get('/signup', function(req,res){
  res.render('signup', {
    title: "Signup",
    message: req.flash('signupMessage')
  });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: 'http://localhost:3000/',
  failureRedirect: '/auth/signup',
  failfureFlash: true
}));

//Login
router.get('/login', function(req,res){
  res.render('login', {
    title: "login",
    message: req.flash('loginMessage')
  });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: 'http://localhost:3000/',
  failureRedirect: '/auth/login',
  failfureFlash: true
}));

module.exports = router;