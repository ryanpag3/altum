/**
 * Created by dev on 6/20/2017.
 */
// 3rd party modules
var express = require('express');
var logger  = require('morgan');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// not sure if needed, run w/o and see if it works
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
// local modules
var users = require('./utils/users.js');

const setupApp = function(app, express, io) {
  // connect mongoose to db
  mongoose.connect('mongodb://localhost/angulobby', {
    useMongoClient: true
  });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));
  db.on('open', function() {
    console.log('connected to database.');
  });
  // user schema/model
  var User = require('./models/user.js');
  // require routes
  var authRoutes = require('./routes/auth.js');
  var queueRoutes = require('./routes/queue.js');
  var gamesRoutes = require('./routes/games.js');
  // middleware definitions
// middleware allows you to define a stack of actions that you should flow through
// express servers themselves are a stack of middlewares
  app.use(express.static(path.join(__dirname, '../public')));
// __dirname is the path to the current module
// for example, __dirname of this file is /angulobby/server/

// dev defined the output of the logger, in this case formats log for dev use
  var sessionMiddleware = expressSession({
    secret: 'TempSecretKey',
    resave: false,
    saveUninitialized: false
  });

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

// passport configuration
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

// routes
  app.use('/user/', authRoutes);
  app.use('/queue/', queueRoutes);
  app.use('/games/', gamesRoutes);

// serve angular front end files from root path
  app.use('/', express.static('public', { redirect: false }));

// rewrite virtual urls to angular app to enable refreshing of internal pages
  app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

// // error handlers
// app.use(function(req, res, next) {
//   var err = new Error('not found');
//   err.status = 404;
//   // report error in middleware
//   next(err);
// });

// TODO: handle production vs development error handling
// TODO: Stack trace will leak to client if error == {}
// TODO: error should be equal to err
// see: https://www.joyent.com/node-js/production/design/errors
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
      message: err.message,
      error: {}
    }));
  });
};

module.exports = setupApp;
