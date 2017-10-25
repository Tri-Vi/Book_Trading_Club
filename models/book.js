var mongoose = require('mongoose');
var BookSchema = mongoose.Schema({
  book_id: String,
  book_title: String,
  book_authors: [String],
  book_publisher: String,
  book_description: String,
  book_link: String,
  book_imageUrl: String
});

var Book = module.exports = mongoose.model('book', BookSchema);