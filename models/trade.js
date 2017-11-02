var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');
var Book = require('./book.js');

var TradeSchema = mongoose.Schema({
  from: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  book: {
    type: Schema.Types.ObjectId, 
    ref: 'Book'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
  createAt: {
    type: Date,
    default: Date.now
  }
});

var Trade = module.exports = mongoose.model('trade', TradeSchema);