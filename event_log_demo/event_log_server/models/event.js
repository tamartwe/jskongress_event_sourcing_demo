// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var EventSchema   = new mongoose.Schema({
  action: String,
  userId: String,
  followsUser: String,
  text: String,
  tweetId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Event', EventSchema);