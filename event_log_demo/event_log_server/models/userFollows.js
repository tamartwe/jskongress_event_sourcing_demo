// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var userFollowsSchema   = new mongoose.Schema({
  userId: String,
  userFollows: Array
});

// Export the Mongoose model
module.exports = mongoose.model('UserFollows', userFollowsSchema);