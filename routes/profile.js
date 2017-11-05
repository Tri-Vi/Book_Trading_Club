
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
const saltRounds = 10;
var User = require('../models/user');
var Book = require('../models/book');
var Trade = require('../models/trade');

//Profile Route
router.get('/', isLoggedIn, function(req,res){
  Book
  .find({book_owner: req.user._id})
  .exec(function(err, books){
    if(err){
      console.log(err);
      return;
    }
    
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
  })
});

//DELETE BOOK FROM THE PROFILE
router.post('/removeBook/:bookID', isLoggedIn, function(req, res){
  var book_id = req.params.bookID;
  // Find book with book_id from Book Collection
  // Remove that book from Book Collection
  // Find book with book_id from 
  User.findById(req.user._id, function(err, user){
    if(err){
      console.log(err);
      return;
    }
    var bookIndex = user.local.addedBooks.indexOf(book_id);
    user.local.addedBooks.splice(bookIndex, 1);
    user.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      
      //Search book in book collection and remove
      Book.findByIdAndRemove(book_id, function(err, book){
        if(err){
          console.log(err);
          return;
        }
        res.redirect('/profile');
      })
    })
  })
}); 

//Trade books
router.post('/trade/:bookID', isLoggedIn, function(req, res){
  var book_id = req.params.bookID;
  var current_user = req.user._id;
  Book
    .findById(book_id)
    .populate({
      path: 'book_owner',
      model: 'user'
    })
    .exec(function(err, book){
      var bookOwner = book.book_owner._id;
      // If the requester is the current user -> Flash A Message "Bad Request"
      if(current_user.equals(bookOwner)){
        req.flash('tradeMessage', 'Bad Request');
        res.redirect('/allbooks');
      } else {

        //1. Trade Collection looks up in database 
        //2. Find if trade is already existed.
        Trade
          .findOne({
            from: current_user,
            to: bookOwner,
            book: book._id,
            status: 'pending'
          }, function(err, trade){
            if(err){
              console.log(err);
              return;
            }
            if(trade){
              //3. If existed, flash message and redirect to allbooks page
              console.log('You already submited trade request to the book owner');
              req.flash('tradeMessage', 'You already submited trade request to the book owner');
              res.redirect('/allbooks');
            } else {
              //4, If not existed, save new trade request to trade collection
              //Create a new trade request 
              var newTrade = new Trade();
              newTrade.from = current_user;
              newTrade.to = bookOwner;
              newTrade.book = book;
              
              //Save new trade request
              newTrade.save(function(err){
                if(err){
                  console.log(err);
                  return;
                }
                //Change Book status from available to pending
                book.book_status = "pending";
                //Save new book status
                book.save(function(err){
                  if(err){
                    console.log(err);
                  }
                  req.flash('tradeMessage', 'Good Request');
                  res.redirect('/allbooks');
                })
              })
            }
          })
      }
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
