// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var UserSchema   = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);