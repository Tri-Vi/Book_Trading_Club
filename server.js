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


/* ****************************************** */
//Passport Config
require('./config/passport.js')(passport);

/* ****************************************** */


// Route
var auth = require('./routes/auth.js');
app.use('/auth', auth);

// App start
app.get('/', function(req, res){
  res.render('home', {title: 'Home'});
});
app.listen(port, function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log('listening on ' + port);
})