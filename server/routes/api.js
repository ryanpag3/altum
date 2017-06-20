/**
 * Created by dev on 6/20/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

router.post('/register', function(req, res) {
  User.register(new User({username: req.body.username}),
    req.body.password, function (err, account) {
    // if any error thrown
    if (err) {
        return res.status(500).json({
          err: err
        });
      }
     passport.authenticate('local')(req, res, function(){
       return res.status(200).json({
         status: 'Registration Successful'
       });
     })
    });
  });

module.exports = router;
