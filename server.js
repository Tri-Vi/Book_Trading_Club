var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var dbUrl = require('./config/db.js').url;

var app =  express();
app.set('view engine', 'ejs');
app.use('views', './views');
app.use(express.static('public'));

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Database connection
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', function(err){
  console.log('There is an error in connection DB');
})
db.on('open', function(){
  console.log('DB Connection established');
})

// App start
app.get('/', function(req, res){
  res.send('hello')
});
app.listen(port, function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log('listening on ' + port);
})