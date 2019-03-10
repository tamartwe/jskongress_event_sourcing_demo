// Load required packages
var Event = require('../models/event');

// Create endpoint /events for POSTS
// Used to create a new record in the event log
exports.postEvents = async (req, res) => {
  // Create a new instance of the Event model
  var event = new Event();

  // Set the event properties that came from the POST data
  // The action : can be 'postTweet', 'likeTweet' and 'followUser' 
  event.action = req.body.action;
  // The user id who performed the action
  event.userId = req.body.userId;
  // This field is used for the 'postTweet' action - this is the
  // tweet's text
  event.text = req.body.text;
  // This field is used to 'likeTweet' action - the tweet id that
  // the user likes
  event.tweetId = req.body.tweetId;
  //This field is used for 'followUser' action - the user that
  // you start to follow.
  event.followsUser = req.body.followsUser;

  // Save the event and check for errors
  try {
    await event.save();    
  } catch (ex) {
    return res.send(ex); 
  }
  // return the event that ws saved
  return res.json({ data: event });
};

// Create endpoint /events for GET
// Used to get all events
exports.getEvents = async (req, res) => {
  // Use the Event model to find all event
  let events;
  try {
    events = await Event.find(); 
  } catch (ex) {
    //send exception
    return  res.send(ex);
  }
  //return all events
  return res.json(events);
};

// Create endpoint /api/events/:event_id for GET
// Used to get an event by id
exports.getEvent = async (req, res) => {
  // Use the Event model to find a specific event
  let event;
  try {
    // find an event by id
    event = await Event.findById(req.params.event_id);    
  } catch (ex) {
    return res.send(ex);
  }
  return res.json(event);
};


