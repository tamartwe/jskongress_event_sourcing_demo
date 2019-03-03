// Load required packages
const Newsfeed = require('../models/newsfeed');
const Event = require('../models/event');
const UserFollows = require('../models/userFollows');


exports.getNewsfeeds = async (req, res) => {
  let newsfeeds;
  try {
    newsfeeds = await Newsfeed.find(); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(newsfeeds);
};


exports.getSingleUserNewsfeed = async (req, res) => {
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
  return res.json(newsfeed[0].twitts);
};

exports.getTwitt = async (req, res) => {
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
  const twitts = newsfeed[0].twitts;
  const text = req.query.text;
  const twitt = twitts.filter((twitt) => twitt.text === text);
  return res.json(twitt);
}

const getFollows = async (userId) => {
  let userFollows;
  try {
    userFollows = await UserFollows.find({'userId' : userId });      
  } catch (ex) {
    console.log('exception on get user follows ' + ex);
    return;
  }
  if (userFollows.length === 0) {
    return null;
  }
  return userFollows[0];
}

const buildTwitts = (newsfeedEvents, userFollows) => {
  const twitts = newsfeedEvents.map((event) => {
    const text = event.text;
    const userTwittedId = event.userId;
    const twittId = event._id.toString();
    const user = userFollows.userFollows.filter((follows) => {
      return follows._id.toString() === userTwittedId
    });
    const twittObj = {};
    twittObj._id = twittId;
    twittObj.text = text;
    twittObj.user = user[0];
    return twittObj;
  });
  return twitts;
}

const getOrCreateNewsfeedInstance = async (mainUserId) => {
  let newsfeed;
  try {
    newsfeed = await Newsfeed.find({'userId' : mainUserId });    
  } catch (ex) {
    console.log('failed fetching newsfeed' + ex);
    return;
  }
  let newsfeedInstance;
  if(newsfeed.length === 0) {
    newsfeedInstance = new Newsfeed();
    newsfeedInstance.userId = mainUserId;
  } else {
    newsfeedInstance = newsfeed[0];
  }
  return newsfeedInstance;
}

const buildNewsfeed = async () => {
  const mainUserId = '5c744e5ed1f08edc8cafe523';
  let userFollows = await getFollows(mainUserId);
  if (userFollows === null) {
    return;
  }
  const userFollowsIds = userFollows.userFollows.map(user => user._id);
  let newsfeedEvents;
  try {
    newsfeedEvents = await Event.find({'action' : 'postTwitt', 'userId' : { '$in' : userFollowsIds}}); 
  } catch (ex) {
    console.log('failed fetching events' + ex);
    return;
  }
  if(newsfeedEvents.length === 0) {
    return;
  }
  let newsfeedInstance = await getOrCreateNewsfeedInstance(mainUserId);
  const twitts = buildTwitts(newsfeedEvents, userFollows);  
  newsfeedInstance.twitts = twitts;
  await newsfeedInstance.save();
}

const buildNewwfeedTimer = async () => {
  await buildNewsfeed();
  setTimeout(buildNewwfeedTimer, 10000)
}

exports.run = buildNewwfeedTimer;




