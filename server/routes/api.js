/**
 * Created by dev on 6/20/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

router.post('/register', function(req, res) {
  console.log('register authentication called');
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
      console.log('login successful');
      res.status(200).json({
        msg: 'Login successful!'
      });
    });
  })(req, res, next); // I'm not sure why these go here, but they were included in the documentation
});

router.get('/logout', function(req, res) {
  // method exposed by passport
  req.logout();
  res.status(200).json({
    msg: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  // method exposed by passport
  if(!req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: false
    });
  }
  res.status(200).json({
    isAuthenticated: true,
    username: req.user.username
  });
});

router.get('/confirm-login', function(req,res) {
  res.send(req.user)
});


module.exports = router;
