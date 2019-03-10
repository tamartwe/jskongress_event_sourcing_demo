// Load required packages
var mongoose = require('mongoose');

// Define our newsfeed schema. Every instance here
// represents a newsfeed for a specific user. This model
// is for the newsfeed to be fetched immedietly
var newsfeedSchema   = new mongoose.Schema({
  // The user id that we are building the newsfeed for
  userId: String,
  // An array of all the tweets in the newsfeed. this array conatins
  // the tweet id and text, and for each tweet the user who tweeted
  // the tweet. for the user we will have all the data required for 
  // display - username, first name and last name.
  tweets: Array
});

// Export the Mongoose model
module.exports = mongoose.model('Newsfeed', newsfeedSchema);