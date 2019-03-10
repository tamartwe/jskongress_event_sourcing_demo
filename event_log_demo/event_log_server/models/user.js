// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema   = new mongoose.Schema({
  // The username of the user
  username: String,
  // The first name of the user
  firstName: String,
  // The last name of the user
  lastName: String
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);