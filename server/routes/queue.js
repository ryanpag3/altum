/**
 * Created by dev on 6/27/2017.
 */
var express = require('express');
var router = express.Router();
var users = require('../utils/users');
var queues = {};
var SERVICE_INTERVAL_IN_MILLIS = 5000;
var LOBBY_SIZE =  5;

// blank to add prototype functions
var queueService = function () {};

router.post('/add', function(req, res) {
  var username = req.body.username, queue = req.body.queue;
  if (queues[queue] === undefined) {
    queues[queue] = [username];
  } else {
    queues[queue].push(username);
  }
  users.addActiveQueue(username, queue);
  console.log(username + ' has been added to ' + queue);
  return res.status(200).json({
    msg: 'Successfully added to queue!'
  });
});

router.post('/remove', function(req, res) {
  var username = req.body.username, queue = req.body.queue;
  // iterate through selected queue until username is reached
  // splice out user
  for (var i = 0; i < queues[queue].length; i ++) {
    if (queues[queue][i] === username) {
      queues[queue].splice(i, 1);
      console.log(username + ' has been removed from ' + queue);
      users.removeActiveQueue(username, queue); // remove from user's active list
      return res.status(200).json({
        msg: username + ' has been removed from ' + queue
      })
    } else {
      console.log(username + ' does not exists in ' + queue);
      return res.status(500).json({
        msg: username + ' does not exists in ' + queue
      })
    }
  }
});

router.post('/remove-all', function(req, res) {
  var username = req.body.username;
  var queueList = users.map[username].activeQueues;
  // iterate through queues user is currently active in
  for (var i = 0; i < queueList.length; i++) {
    var queue = queueList[i];
    for (var x = 0; x < queues[queue].length; i++) {
      if (queues[queue][x] === username) { // username found in queue
        queues[queue].splice(x, 1); // splice out
        console.log(username + ' removed from ' + queue);
        users.removeActiveQueue(username, queue); // remove queue from user's active list
      }
    }
  }

  if (users.map[username].activeQueues.length === 0) {
    return res.status(200).json({
      msg: 'user successfully removed from all queues'
    })
  } else {
    return res.status(500).json({
      msg: 'error'
    })
  }
});

/**
 * starts the queue service, which checks each created queue for users
 * @type {queueService.startService}
 */
var startService = queueService.prototype.startService = function() {
  // iterate through all active queues
  for (var qName in queues) {
    if (queues[qName].length >= LOBBY_SIZE) {
      var lobbyId = 1234;
      var username = queues[qName].shift(); // FIFO
      users.map[username].lobby = lobbyId;
      users.map[username].socket.join(lobbyId);
      console.log(username + ' has joined lobby: ' + lobbyId);
    }
  }
};
var intervalId = setInterval(startService, SERVICE_INTERVAL_IN_MILLIS);

module.exports = router;
