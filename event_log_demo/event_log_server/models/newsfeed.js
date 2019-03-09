// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var newsfeedSchema   = new mongoose.Schema({
  userId: String,
  tweets: Array
});

// Export the Mongoose model
module.exports = mongoose.model('Newsfeed', newsfeedSchema);