// Load required packages
const UserFollows = require('../models/userFollows');
const Event = require('../models/event');
const User = require('../models/user');


exports.getUserFollows = async (req, res) => {
  let userFollows;
  try {
    userFollows = await UserFollows.find(); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(userFollows);
};


exports.getSingleUserFollows = async (req, res) => {
  let userFollows;
  try {
    const mainUserId= req.params.user_id;
    userFollows = await UserFollows.find({'userId' : mainUserId });      
  } catch (ex) {
    return res.send(ex);
  }
  if (userFollows.length === 0) {
    return res.json({});
  }
  return res.json(userFollows[0].userFollows);
};

const buildUserFollows = async () => {
  let followsEvents;
  try {
    followsEvents = await Event.find({'action' : 'FollowUser'}); 
  } catch (ex) {
    return;
  }
  if(followsEvents.length === 0) {
    return;
  }
  const users = await Promise.all(followsEvents.map(async (event) =>  { 
    console.log('user id ' + event.followsUser);
    return User.findById(event.followsUser)
  }
  ));
  const mainUserId = followsEvents[0].userId;
  let userFollows;
  try {
    userFollows = await UserFollows.find({'userId' : mainUserId });    
  } catch (ex) {
    console.log('failed fetching follows' + ex);
    return;
  }
  let userFollowsInstance;
  if(userFollows.length === 0) {
    userFollowsInstance = new UserFollows();
    userFollowsInstance.userId = mainUserId;
  } else {
    userFollowsInstance = userFollows[0];
  }
  userFollowsInstance.userFollows = users;
  await userFollowsInstance.save();
}

const buildFollowsTimer = async () => {
  await buildUserFollows();
  setTimeout(buildFollowsTimer, 10000)
}

exports.run = buildFollowsTimer;




