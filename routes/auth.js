var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.send('hello from auth')
});
// Sign Up
router.get('/signup', function(req, res){
  res.render('signup', {title: 'Sign Up'});
});

// Login
router.get('/login', function(req, res){
  res.render('login', {title: 'Log In'})
});

module.exports = router;