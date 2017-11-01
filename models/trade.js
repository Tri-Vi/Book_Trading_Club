var mongoose = require('mongoose');
var TradeSchema = mongoose.Schema({
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

var Trade = module.exports = mongoose.model('trade', TradeSchema);