var express = require('express');
var router = express.Router();
var Book = require('../models/book.js');
var User = require('../models/user.js');
var Trade = require('../models/trade.js');

router.get('/', isLoggedIn, function(req, res){
  Book
    .find({book_status: 'available'})
    .populate({
      path: 'book_owner',
      model: 'user'
    })
    .exec(function(err, books){
      if(err){
        console.log(err);
        return;
      }
      var current_user = req.user._id;

      //Get total 'pending request' from other book owners to current user
      Trade
        .find({
          to: current_user,
          status: 'pending'
        })
        .populate({
          path: 'book',
          model: 'book'
        })
        .exec(function(err, reqsFromOwnerToUser){ //Trade requests for you
        var reqsFromOwnerToUserCount = reqsFromOwnerToUser.length;

        //Get total 'pending request' from current user to other book owners
        Trade.find({
          from: current_user,
          status: 'pending'
        }).populate({
          path: 'book',
          model: 'book'
        }).
        exec(function(err, reqsFromUserToOwner){ // Your Trade Requests
          var reqsFromUserToOwnerCount = reqsFromUserToOwner.length;
          //console.log(reqsFromOwnerToUser);
          res.render('allbooks', {
            title: 'All Books',
            message: req.flash('tradeMessage'),
            books: books,
            reqsFromOwnerToUser: reqsFromOwnerToUser,
            reqsFromUserToOwner: reqsFromUserToOwner
          })
        })
      })
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