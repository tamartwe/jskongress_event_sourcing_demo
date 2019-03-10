// Load required packages
const Newsfeed = require('../models/newsfeed');
const Event = require('../models/event');
const UserFollows = require('../models/userFollows');

// Create endpoint /newsfeed for GET
//Used to get all the newsfeeds for all the users
exports.getNewsfeeds = async (req, res) => {
  let newsfeeds;
  try {
    // use the newsfeed model to find all the newsfeeds
    newsfeeds = await Newsfeed.find(); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(newsfeeds);
};

// Create endpoint /newsfeed/:user_id for GET
//Used to get all the newsfeeds for all the users
exports.getSingleUserNewsfeed = async (req, res) => {
  let newsfeed;
  try {
    // get user id from request
    const mainUserId= req.params.user_id;
    //find the newsfeed by the user id 
    newsfeed = await Newsfeed.find({'userId' : mainUserId });      
  } catch (ex) {
    return res.send(ex);
  }
  if (newsfeed.length === 0) {
    // If no instance exists - return an empty list to the client
    return res.json({});
  }
  // return the tweets of the newsfeed to the client
  return res.json(newsfeed[0].tweets);
};

exports.gettweet = async (req, res) => {
  let newsfeed;
  try {
    const mainUserId= req.params.user_id;
    newsfeed = await Newsfeed.find({'userId' : mainUserId });      
  } catch (ex) {
    return res.send(ex);
  }
  if (newsfeed.length === 0) {
    return res.json({});
  }
  const tweets = newsfeed[0].tweets;
  const text = req.query.text;
  const tweet = tweets.filter((tweet) => tweet.text === text);
  return res.json(tweet);
}

const getFollows = async (userId) => {
  let userFollows;
  try {
    userFollows = await UserFollows.find({'userId' : userId });      
  } catch (ex) {    
    return;
  }
  if (userFollows.length === 0) {
    return null;
  }
  return userFollows[0];
}

// Build the tweets array for the newsfeed instance. Each
// tweet will have all the data ready for display - tweet text,
// username, firstname, lastname
const buildtweets = (newsfeedEvents, userFollows) => {
  // newsfeed events parameter - events that are of type
  // 'postTweet' and are tweets of thw users that I follow
  const tweets = newsfeedEvents.map((event) => {
    const text = event.text;
    const usertweetedId = event.userId;
    const tweetId = event._id.toString();
    // Getting the user details from the follows list
    const user = userFollows.userFollows.filter((follows) => {
      return follows._id.toString() === usertweetedId
    });
    // Prepare the tweet object
    const tweetObj = {};
    // assign the tweet id
    tweetObj._id = tweetId;
    // Assign the tweet text
    tweetObj.text = text;
    // Assign the user object - will conatin username, firstname
    // and last name
    tweetObj.user = user[0];
    return tweetObj;
  });
  return tweets;
}
// Get an instance of the newsfeed model by user id. If no instance exists
// for the specific user - create one  
const getOrCreateNewsfeedInstance = async (mainUserId) => {
  let newsfeed;
  try {
    // Find a newsfeed instance by user id
    newsfeed = await Newsfeed.find({'userId' : mainUserId });    
  } catch (ex) {
    return;
  }
  let newsfeedInstance;
  if(newsfeed.length === 0) {
    // Newsfeed instance for that user does not exist - create 
    // a new newsfeed instance for the user.
    newsfeedInstance = new Newsfeed();
    // Assign user id for the instance
    newsfeedInstance.userId = mainUserId;
  } else {
    // Instance exist - return the first object in the array
    // (query returns an array )
    newsfeedInstance = newsfeed[0];
  }
  return newsfeedInstance;
}

// Building the newsfeed for all the users
const buildNewsfeed = async () => {
  // For the demo - this function will build the newsfeed for one user
  const mainUserId = '5c744e5ed1f08edc8cafe523';
  // Getting all the users that this user follows
  let userFollows = await getFollows(mainUserId);
  if (userFollows === null) {
    return;
  }
  // Getting the Ids of the users from the following list
  const userFollowsIds = userFollows.userFollows.map(user => user._id);
  let newsfeedEvents;
  try {
    // Find all the events from the event log of type 'postTweet'
    // To build the newsfeed
    newsfeedEvents = await Event.find({'action' : 'postTweet', 'userId' : { '$in' : userFollowsIds}}); 
  } catch (ex) {
    return;
  }
  if(newsfeedEvents.length === 0) {
    return;
  }
  // Get an instance of the newsfeed model . If no instance exists
  // for the specific user - create one
  let newsfeedInstance = await getOrCreateNewsfeedInstance(mainUserId);
  // Build the list of tweets for the newsfeed. Each tweet
  // Will contain all the required details for display . The
  // tweet text, the user name , the user first name and the user last
  // name
  const tweets = buildtweets(newsfeedEvents, userFollows);  
  // Assign tweets to the newsfeed instance
  newsfeedInstance.tweets = tweets;
  await newsfeedInstance.save();
}

// A timer that is executing 
const buildNewsfeedTimer = async () => {
  // Call buildNewsfeed functionto buikd the newsfeed for all the users
  await buildNewsfeed();
  // Building the newsfeed every 10 seconds
  setTimeout(buildNewsfeedTimer, 10000)
}

exports.run = buildNewsfeedTimer;






