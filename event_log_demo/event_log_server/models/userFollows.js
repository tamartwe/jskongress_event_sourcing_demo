// Load required packages
var mongoose = require('mongoose');

// Define our userFollows schema
var userFollowsSchema   = new mongoose.Schema({
  // The user id that we are building the following list for 
  userId: String,
  // An array of the users that this user is following. Every
  // Object in the array will contain the username, the first name 
  // and the last name - all the required details for display.
  userFollows: Array
});

// Export the Mongoose model
module.exports = mongoose.model('UserFollows', userFollowsSchema);