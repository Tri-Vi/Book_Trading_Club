var express = require('express');
var passport = require('passport');
var router = express.Router();

// router.get('/*', function(req, res){
//   res.render('login', {
//     title: "login",
//     message: req.flash('loginMessage')
//   });
// });
//Sign up
router.get('/signup', function(req,res){
  res.render('signup', {
    title: "Signup",
    message: req.flash('signupMessage')
  });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/auth/login', // redirect to login after sign up
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
  successRedirect: '/profile', //redirect to profile
  failureRedirect: '/auth/login',
  failfureFlash: true
}));


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})
module.exports = router;