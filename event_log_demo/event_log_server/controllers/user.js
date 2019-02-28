// Load required packages
var User = require('../models/user');

// Create endpoint /users for POSTS
exports.postUsers = async (req, res) => {
  // Create a new instance of the User model
  var user = new User();

  // Set the user properties that came from the POST data
  user.username = req.body.username;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;

  // Save the user and check for errors
  try {
    await user.save();    
  } catch (ex) {
    return res.send(ex); 
  }
  return res.json({ message: 'User added to the locker!', data: user });
};

// Create endpoint /users for GET
exports.getUsers = async (req, res) => {
  // Use the User model to find all user
  let users;
  try {
    let filter = {};
    if (req.query.term) {
      filter  = {'username' : { '$regex' : req.query.term, '$options' : 'i' } };
    }
    users = await User.find(filter); 
  } catch (ex) {
    return  res.send(ex);
  }
  return res.json(users);
};

// Create endpoint /users/:user_id for GET
exports.getUser = async (req, res) => {
  // Use the User model to find a specific user
  let user;
  try {
    user = await User.findById(req.params.user_id);    
  } catch (ex) {
    return res.send(ex);
  }
  return res.json(user);
};


