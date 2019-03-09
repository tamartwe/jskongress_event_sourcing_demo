// Load required packages
var Event = require('../models/event');

// Create endpoint /api/events for POSTS
exports.postEvents = async (req, res) => {
  // Create a new instance of the Event model
  var event = new Event();

  // Set the event properties that came from the POST data
  event.action = req.body.action;
  event.userId = req.body.userId;
  event.text = req.body.text;
  event.tweetId = req.body.tweetId;
  event.followsUser = req.body.followsUser;

  // Save the event and check for errors
  try {
    await event.save();    
  } catch (ex) {
    return res.send(ex); 
  }
  return res.json({ data: event });
};

// Create endpoint /api/events for GET
exports.getEvents = async (req, res) => {
  // Use the Event model to find all event
  let events;
  try {
    events = await Event.find(); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(events);
};

// Create endpoint /api/events/:event_id for GET
exports.getEvent = async (req, res) => {
  // Use the Event model to find a specific event
  let event;
  try {
    event = await Event.findById(req.params.event_id);    
  } catch (ex) {
    return res.send(ex);
  }
  return res.json(event);
};


