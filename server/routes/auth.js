/**
 * Created by dev on 6/20/2017
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

/**
 * when a client requests this endpoint, we call the passport authentication strategy and handle if any errors
 * are thrown. We then authenticate the users information to serialize it into the database.
 * @returns {JSON} error or success msg
 */
router.post('/register', function(req, res) {
  User.register(new User({username: req.body.username}),
    req.body.password, function (err, account) {
    // if any error thrown
    if (err) {
      console.log(err.message);
        return res.status(500).json({
          msg: err
        });
      }
      // passport.authenticate handles encrypting the data
     passport.authenticate('local')(req, res, function(){
       return res.status(200).json({
         msg: 'Registration Successful'
       });
     })
    });
  });

/**
 * this endpoint calls our passport authentication strategy for the specified user credentials and calls the strategy
 * function logIn to determine user authentication.
 * @returns {JSON} success or failure message with error code
 */
router.post('/login', function(req, res, next) {
  // passport strategy & callback function
  // if authentication fails, user will be set to false
  // if exception occurs, error will be set
  // info contains optional details provided by the strategies callback
  passport.authenticate('local', function(err, user, info) {
    console.log('passport.authenticate called');
    // if error was thrown
    // see: https://derickbailey.com/2014/09/06/proper-error-handling-in-expressjs-route-handlers/
    // returns error to error handler asynchronously
    if (err) {
      return next(err);
    }
    // if user does not exist
    if (!user) {
      return res.status(401).json({
        msg: info
      });
    }

    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          msg: 'Could not log in user'
        });
      }
      console.log(user.username + ' has connected.');
      res.status(200).json({
        msg: 'Login successful!'
      });
    });
  })(req, res, next); // I'm not sure why these go here, but they were included in the documentation
});

/**
 * Calls our passport strategies logout function
 * @returns {JSON} json object with logout message
 */
router.get('/logout', function(req, res) {
  // method exposed by passport
  req.logout();
  res.status(200).json({
    msg: 'Bye!'
  });
});

/**
 * Calls the passport strategy's authentication status method.
 * @returns {JSON} success: authenticated boolean and authenticated username
 *                   error: authenticated boolean
 */
router.get('/status', function(req, res) {
  // method exposed by passport
  if(!req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: false
    });
  }
  return res.status(200).json({
    isAuthenticated: true,
    username: req.user.username
  });
});

/**
 * Retrieves the currently authenticated user object.
 * @returns {JSON} success: user object
 *                 failure: error message
 */
router.get('/info', function(req, res) {
  if (req.isAuthenticated()) {
    // TODO include social media links/profile picture link
    var user = {name: req.user.username};
    return res.status(200).json({
      user: user
    })
  } else {
    return res.status(500).json({
      msg: 'could not get user info'
    })
  }
});

module.exports = router;
