var express =  require('express');
var router = express.Router();
var User = require('../models/user.js');
var Trade = require('../models/trade.js');
var Book = require('../models/book.js');

router.get('/', isLoggedIn, function(req, res){
  res.render('trade', {
    title: "Trade"
  })
});
// Trade Request For You
// Accept Request
router.post('/acceptRequest/:tradeID', isLoggedIn, function(req, res){
  var trade_id = req.params.tradeID;
  //Find the trade 
  Trade
    .findById(trade_id)
    .populate({
      path: 'book',
      model: 'book'
    })
    .exec(function(err, trade){
      var book_id = trade.book._id;
      //Search Book Id
      Book
        .findById(book_id)
        .populate({
          path: 'book_owner',
          model: 'user'
        })
        .exec(function(err, book){
          //Update new owner for book owner && book status
          var oldOwner_id = book.book_owner; //b
          var newOwner_id = trade.from; //req.user._id; //a
          book.book_owner = newOwner_id;
          book.book_status = 'available';
          book.save(function(err){
            if(err){
              console.log(err);
              return;
            }
            // Add the new book to new owner's book list
            User
              .findById(newOwner_id) //b
              .exec(function(err, user){
                user.local.addedBooks.push(book_id);
                user.save(function(err){
                  if(err){
                    console.log(err);
                    return;
                  }
                  //Remove the trade book from the old book owner's book list
                  User
                    .findById(oldOwner_id)
                    .exec(function(err, user){
                      if(err){
                        console.log(err);
                        return;
                      }
                      var bookIndex = user.local.addedBooks.indexOf(book_id);
                      //Pop the book out of the array
                      user.local.addedBooks.splice(bookIndex, 1);
                      user.save(function(err){
                        if(err){
                          console.log(err);
                          return;
                        }
                        //Remove the trade transaction
                        trade.remove(function(err){
                          if(err){
                            console.log(err);
                            return;
                          }
                          res.redirect('/allbooks');
                        })
                      })
                    })
                })
              })
          })
        });
    });
});

// Reject Request
router.post('/rejectRequest/:tradeID', isLoggedIn, function(req,res){
  var trade_id = req.params.tradeID;
  Trade
    .findById(trade_id)
    .populate({
      path: 'book',
      model: 'book'
    })
    .exec(function(err, trade){
      if(err){
        console.log(err);
        return;
      }
      var book_id = trade.book._id;
      Book
        .findById(book_id)
        .exec(function(err, book){
          book.book_status = "available";
          book.save(function(err){
            if(err){
              console.log(err);
              return;
            }
            trade.remove(function(err){
              if(err){
                console.log(err);
                return;
              }
              res.redirect('/allbooks');
            })
          })
        })

    })
  res.send('rejected request');
});

// Your Trade Request
// Cancel Request
router.post('/cancelRequest/:tradeID', isLoggedIn, function(req, res){
  // Cancel Request From Current User to book owner
  var trade_id = req.params.tradeID;
  Trade
    .findById(trade_id)
    .populate({
      path: 'book',
      model: 'book'
    })
    .exec(function(err, trade){
      if(err){
        console.log(err);
        return;
      }
      var book_id = trade.book._id;
      Book
        .findById(book_id)
        .exec(function(err, book){
          console.log(book);
          book.book_status = "available";
          book.save(function(err){
            if(err){
              console.log(err);
              return;
            }
            trade.remove(function(err){
              if(err){
                console.log(err);
                return;
              }
              res.redirect('/allbooks');
            })
          })
        })
    });
})

function isLoggedIn(req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
module.exports = router;