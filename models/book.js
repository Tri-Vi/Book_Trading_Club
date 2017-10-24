var mongoose = require('mongoose');
var BookSchema = mongoose.Schema({

});

var Book = module.exports = mongoose.model('book', BookSchema);