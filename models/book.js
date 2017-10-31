var mongoose = require('mongoose');
var User = require('./user.js'); // User Model
var Schema = mongoose.Schema;

var BookSchema = mongoose.Schema({
  book_id: String,
  book_title: String,
  book_authors: [String],
  book_publisher: String,
  book_description: String,
  book_link: String,
  book_imageUrl: String,
  book_owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Book = module.exports = mongoose.model('book', BookSchema);