var express = require('express');
var bodyParser = require('body-parser');
var app =  express();
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('views', './views');
app.use(express.static('public'));

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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