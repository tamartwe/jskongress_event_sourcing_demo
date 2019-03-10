// Load required packages
const UserFollows = require('../models/userFollows');
const Event = require('../models/event');
const User = require('../models/user');


// Create endpoint /userFollows for GET
// Used to get all the user follows instances
exports.getUserFollows = async (req, res) => {
  let userFollows;
  try {
    // Find all the users follows instances 
    userFollows = await UserFollows.find(); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(userFollows);
};

// Create endpoint /userFollows/:user_id for GET
// Used to get the user follows instance for a specific user id
exports.getSingleUserFollows = async (req, res) => {
  let userFollows;
  try {
    // Getting the user id from the request
    const mainUserId= req.params.user_id;
    // Find the user follows instance by the user id
    userFollows = await UserFollows.find({'userId' : mainUserId });      
  } catch (ex) {
    return res.send(ex);
  }
  if (userFollows.length === 0) {
    return res.json({});
  }
  // Return the follows list to the client 
  // This is the list of all the users with all their display details
  return res.json(userFollows[0].userFollows);
};

// Get all the events pf type 'userFollows', each event record
// represent a follow action
const getFollowsEvents = async () => {
  let followsEvents;
  try {
    // Find all the events in the event log that represent 
    // a 'FollowUser' action
    followsEvents = await Event.find({'action' : 'followUser'}); 
  } catch (ex) {    
    return null;
  }
  if(followsEvents.length === 0) {
    return null;
  }
  // Retrun all the 'followUser' events from the event log
  return followsEvents;
}

// Get or create a user follows instance. If the instance exists, return 
// it, if not, create it for the user
const getOrCreateUserFollowsInstance = async (mainUserId) => {
  let userFollows;
  try {
    // Find the user follows instance by user id
    userFollows = await UserFollows.find({'userId' : mainUserId });    
  } catch (ex) {
    return;
  }
  let userFollowsInstance;
  if(userFollows.length === 0) {
    // Instance does not exsist, creating it
    userFollowsInstance = new UserFollows();
    // Assign the user id to the newly created instance
    userFollowsInstance.userId = mainUserId;
  } else {
    // Instance exists, returning the first elemnt in the array 
    // (query returns an array and not a single instance)
    userFollowsInstance = userFollows[0];
  }
  // return instance
  return userFollowsInstance;
}

// Building the user follows list
const buildUserFollows = async () => {
  // Get all the events pf type 'userFollows', each event record
  // represent a follow action
  let followsEvents = await getFollowsEvents();
  if (followsEvents === null) {
    return;
  }
  // For every event - get the specific user details by querying 
  // the user collection
  const users = await Promise.all(followsEvents.map((event) =>  { 
    return User.findById(event.followsUser)
  }
  ));
  const mainUserId = followsEvents[0].userId;
  // Create the user follows instance 
  let userFollowsInstance = await getOrCreateUserFollowsInstance(mainUserId);
  // Set the users list built above to the user follows instance
  // When we will fetch the instance we will have immedietly all 
  // the required details for display 
  userFollowsInstance.userFollows = users;
  // Save the user follows instance
  await userFollowsInstance.save();
}

// A timer for building the user follows list
const buildFollowsTimer = async () => {
  // Call the build user follows list function
  await buildUserFollows();
  // Schedule another run to 10 seconds
  setTimeout(buildFollowsTimer, 10000)
}

// exporting the timer function to build the follows user list 
// periodically
exports.run = buildFollowsTimer;




