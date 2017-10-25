
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var User = require('../models/user');
var Book = require('../models/book');

router.get('/', isLoggedIn, function(req,res){
  res.render('profile', {
    title: "Profile"
  })
});

//Change Profile Setting
router.get('/setting/:id', isLoggedIn, function(req, res){
  res.render('profile_setting', {
    title: 'Setting',
    message: req.flash('settingMessage')
  })
});

//UPDATE POST SETTING
router.post('/setting/:id', isLoggedIn, function(req, res){
  var id = req.params.id;
  var newUsername = req.body.username;
  var newEmail =  req.body.email;
  var newPassword = req.body.password;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(newPassword, salt);
  User.findByIdAndUpdate(id, {
    "local.username" : newUsername,
    "local.email": newEmail,
    "local.password": hash
  }, {
    new: true
  },function(err, user){
    if(err){
      res.flash('settingMessage', 'There is an error. Please check your input or try again later!');
      res.redirect('/');
    }
    res.redirect('/profile');
  })
});

//ADD BOOK TO PROFILE
router.post('/addBook',isLoggedIn, function(req,res){
  var book_id = req.body.book_id; // String
  var book_title = req.body.book_title; // String
  var book_authors = req.body.book_authors; // Array
  var book_publisher = req.body.book_publisher; // String
  var book_description = req.body.book_description; // String
  var book_link = req.body.book_link; // String
  var book_imageUrl = req.body.book_imageUrl; // String;
  console.log(req.body);
  res.send(req.body);
});


//LOGIN FUNCTION
function isLoggedIn (req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
