const Event = require('../models/event');


// Create endpoint /like/:tweet_id for GET
exports.getLike = async (req, res) => {
  // Use the Event model to find all relevant likes
  let events;
  try {
    events = await Event.find({ 'action': 'Liketweet', 'tweetId' : req.params.tweet_id});    
  } catch (ex) {
    return res.send(ex);
  }
  const numLikes = events.length;
  return res.json({'likes' : numLikes});
};
  