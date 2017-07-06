/**
 * Created by dev on 6/27/2017.
 */
var express = require('express');
var router = express.Router();
var QueueManager = require('../utils/queue-manager');
var queueManager = new QueueManager();
console.log('you are inside queue.js route handler');
var users = require('../utils/users');
var queues = {};
var SERVICE_INTERVAL_IN_MILLIS = 5000;
var LOBBY_SIZE =  3;

router.post('/add', function(req, res) {
  var username = req.body.username, queue = req.body.queue;
  // add user to queue
  var added = queueManager.add(username, queue);
  if (added) {
    return res.status(200).json({
      msg: username + ' was successfully added to ' + queue
    })
  } else {
    return res.status(500).json({
      msg: 'Error! ' + username + ' was not added to ' + queue
    })
  }
});

router.post('/remove', function(req, res) {
  var username = req.body.username, queue = req.body.queue;
  var removed = queueManager.remove(username, queue);
  if (removed) {
    return res.status(200).json({
      msg: username + ' was successfully removed from ' + queue
    })
  } else {
    return res.status(500).json({
      msg: username + ' could not be removed from ' + queue
    })
  }
});

router.post('/remove-all', function(req, res) {
  var username = req.body.username;
  var removed = queueManager.removeAll(username);
  if (removed) {
    return res.status(200).json({
      msg: username + ' has been removed from all queues.'
    })
  } else {
    return res.status(500).json({
      msg: username + ' has not been removed from all queues. If you see this,' +
      ' please contact the developers.'
    })
  }
});
//
// /**
//  * starts the queue service, which checks each created queue for users
//  * @type {queueService.startService}
//  */
// var startService = queueService.prototype.startService = function() {
//   // iterate through all active queues
//   for (var qName in queues) {
//     if (queues[qName].length >= LOBBY_SIZE) {
//       var lobbyId = 1234;
//       var lobbyMembers = [];
//       for (var i = 0; i < LOBBY_SIZE; i++) {
//         lobbyMembers.push(queues[qName].shift());
//       }
//       createLobby(lobbyMembers);
//   }
//
// }


/**
 * Helper functions
 */

  /**
   * Creates a new lobby ID and assigns users to it.
   * @param lobbyMembers: array of usernames to assign to lobby
   */
  // function createLobby(lobbyMembers) {
  //   var lobby = makeLobbyId();
  //   for (var i = 0; i < lobbyMembers.length; i++) {
  //     users.map[lobbyMembers[i]].lobby = lobbyId;
  //     users.removeAllActiveQueues(lobbyMembers[i]);
  //     console.log(lobbyMembers[i] + ' has been assigned to lobby: ' + lobbyId);
  //   }
  // };
// setInterval(startService, SERVICE_INTERVAL_IN_MILLIS);

// creates a unique lobby name
var makeLobbyId = function() {
  var length = 16;
  var text = "";
  var potential = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    text += potential.charAt(Math.floor(Math.random() * potential.length));
  }
  return text;
};



module.exports = router;
