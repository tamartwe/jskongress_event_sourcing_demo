// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var EventSchema   = new mongoose.Schema({
  //The action that the specific event log record reresent. Can be 1 
  //3 possibilities : postTweet, followUser and Liketweet
  action: String,
  //The user who performed the action . Meaning the user who post the tweet
  //The user who liked the tweet or the user who foolow other user.
  userId: String,
  //Used for records of type 'followUser'. This is the user that the user
  // Who performed the activity is following.
  followsUser: String,
  //Used for records of type 'postTweet'. This is the text of the tweet that 
  // the user tweetted
  text: String,
  //Used for records of type 'likeTweet'. This is the tweet id that the user
  //liked
  tweetId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Event', EventSchema);