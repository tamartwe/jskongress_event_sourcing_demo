// Load required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const eventController = require('./controllers/event');
const userController = require('./controllers/user');
const userFollowsController = require('./controllers/userFollows');
const newsfeedController = require('./controllers/newsfeed');
const likeController = require('./controllers/like');

const cors = require('cors');

// Connect to the eventlocker MongoDB
mongoose.connect('mongodb://localhost:27017/events', {useNewUrlParser: true});

// Create our Express application
const app = express();

app.use(cors());
app.options('*', cors());

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

userFollowsController.run();
newsfeedController.run();


// Create our Express router
const router = express.Router();

// Create endpoint handlers for /events
router.route('/events')
  .post(eventController.postEvents)
  .get(eventController.getEvents);

// Create endpoint handlers for /events/:event_id
router.route('/events/:event_id')
  .get(eventController.getEvent)

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

// Create endpoint handlers for /users/:event_id
router.route('/users/:user_id')
  .get(userController.getUser)


// Create endpoint handlers for /userFollows
router.route('/userFollows')
  .get(userFollowsController.getUserFollows);

// Create endpoint handlers for /userFollows/:user_id
router.route('/userFollows/:user_id')
  .get(userFollowsController.getSingleUserFollows)

// Create endpoint handlers for /newsfeed
router.route('/newsfeed')
  .get(newsfeedController.getNewsfeeds);

// Create endpoint handlers for /newsfeed/:user_id
router.route('/newsfeed/:user_id')
  .get(newsfeedController.getSingleUserNewsfeed)

// Create endpoint handlers for /newsfeed/:user_id
router.route('/twitt/:user_id')
  .get(newsfeedController.getTwitt)

router.route('/like/:twitt_id')
  .get(likeController.getLike)


// Register all our routes with /api
app.use('/', router);

// Start the server
app.listen(3000);
