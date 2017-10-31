
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
const saltRounds = 10;
var User = require('../models/user');
var Book = require('../models/book');

//Test Route
router.get('/test', isLoggedIn, function(req, res){
  Book
    .find({book_owner: req.user._id})
    .exec(function(err, books){
      if(err){
        console.log(err);
        return;
      }
      //console.log('There books are an array' + books);
      res.render("test", {
        title: "Test_Profile Page",
        books: books
      })
    })
});

//Profile Route
router.get('/', isLoggedIn, function(req,res){
  Book
  .find({book_owner: req.user._id})
  .exec(function(err, books){
    if(err){
      console.log(err);
      return;
    }
    //console.log('There books are an array' + books);
    res.render("profile", {
      title: "Profile Page",
      books: books
    })
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
  var newBook = new Book();
  //newBook._id = mongoose.Types.ObjectId(),
  newBook.book_id = req.body.book_id; // String
  newBook.book_title = req.body.book_title; // String
  newBook.book_authors = req.body.book_authors; // Array
  newBook.book_publisher = req.body.book_publisher; // String
  newBook.book_description = req.body.book_description; // String
  newBook.book_link = req.body.book_link; // String
  newBook.book_imageUrl = req.body.book_imageUrl; // String;
  newBook.book_owner = req.user._id;
  
  newBook.save(function(err){
    if(err){
      console.log(err);
    }
    User.findById(req.user._id, function(err, user){
      if(err){
        console.log(err);
        return;
      }
      user.local.addedBooks.push(newBook);
      user.save(function(err){
        if(err){
          console.log(err);
          return;
        }
        res.redirect('/profile');
      })
    })
    // User.findByIdAndUpdate(req.user._id,{
    //   $push: {addedBooks: newBook._id}
    // },{new: true}, function(err, user){
    //   if(err){
    //     console.log(err);
    //     return;
    //   }
    //   res.send(user);
    // })
  })
});


//LOGIN FUNCTION
function isLoggedIn (req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
