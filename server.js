var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var url = require('./config/db.js').url;
mongoose.connect(url);
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon')
var path = require('path');
var port = process.env.PORT || 3000;
var books = require('google-books-search');
var app = express();

/* ****************************************** */
app.use(compression());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

/* ****************************************** */
//DB
var db = mongoose.connection;
db.on('error', function(error){
  console.log(error);
});
db.on('open', function(){
  console.log('Connected to DB');
});
var User = require('./models/user.js');
var Book = require('./models/book.js');
var Trade = require('./models/trade.js');


/* ****************************************** */
//Passport Config
require('./config/passport.js')(passport);

/* ****************************************** */

//BOOK API 
var option = require('./config/bookAPI.js');

// Route
var auth = require('./routes/auth.js');
app.use('/auth', auth);
var profile = require('./routes/profile.js');
app.use('/profile', profile);
var trade = require('./routes/trade.js');
app.use('/trade', trade);
var allbooks = require('./routes/allbooks.js');
app.use('/allbooks', allbooks);

// App start
app.get('/', function(req, res){
  books.search('Web Development', {
    field: "title",
    offset: 0,
    limit: 9,
    type: 'books',
    order: 'relevance',
    lang: 'en'
  }, function(error, results, apiResponse){
    if(error){
      res.send(error);
    } else {
      res.render('home', {
        title: "Home",
        books: results
      })
    }
  })
});

//Testing Book API
// app.get('/api', function(req, res){
//   books.search('Monkey', option, function(error, results, apiResponse){
//     if(!error){
//       res.send(results);
//     } else {
//       console.log(error);
//     }
//   })
// });

app.get('/search', function(req, res){
  var title = req.query.title;
  //console.log(title);
  books.search(title, {
    field: "title",
    offset: 0,
    limit: 40,
    type: 'books',
    order: 'relevance',
    lang: 'en'
  }, function(error, results, apiResponse){
    if(!error){
      res.render('search', {
        title: 'Search Book',
        books: results
      })
    } else {
      console.log(error);
      res.status(404).send('File Not Found!');
    }
  })
});

app.listen(port, function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log('listening on ' + port);
})