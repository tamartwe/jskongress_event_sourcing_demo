// Load required packages
var Event = require('../models/event');


// Create endpoint /api/events for GET
exports.getFollowers = async (req, res) => {
  // Use the Event model to find all event
  const userId = req.body.userId;
  let events;
  try {
    events = await Event.find({'followsUser': userId}); 
  } catch (ex) {
    return  res.send(ex);
  }
  const users = events.map(event => event.userId);
  return res.json(users);
};

exports.getNewsfeed = async (req, res) => {
  const users = req.body.users;
  let events;
  try {
    events = await Event.find({'action': 'tweet', 'userId': {$in : users}}); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(events);

}


