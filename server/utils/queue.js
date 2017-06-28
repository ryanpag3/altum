/**
 * Created by dev on 6/27/2017.
 */
var express = require('express');
var router = express.Router();
var userModule = require('./users');
var queues = {};
var SERVICE_INTERVAL_IN_MILLIS = 5000;

// blank to add prototype functions
var queueService = function () {};

router.post('/add-to-queue', function(req, res) {

});

/**
 * starts the queue service, which checks each created queue for users
 * @type {queueService.startService}
 */
var startService = queueService.prototype.startService = function() {
  console.log('service pulse...');
  // iterate through all active queues
  for (var qName in queues) {
    if (queues[qName].length >= 1) {
      var lobbyId = 1234;
      var username = queues[qName].shift(); // FIFO
      userModule.users[username].lobby = lobbyId;
      userModule.users[username].socket.join(lobbyId);
    }
  }
};
var intervalId = setInterval(startService, SERVICE_INTERVAL_IN_MILLIS);

queueService.prototype.stopService = function () {
  console.log('service stopped...');
  clearInterval(intervalId);
};

queueService.prototype.addToQueue = function(username, queueName) {
  if (queues[queueName] === undefined) {
    queues[queueName] = [username];
    console.log(queueName + ' has been created. Length is now 1.')
  } else {
    queues[queueName].push(username);
    console.log('user has been added to ' + queueName + ', length is now: ' + queues[queueName].length);
  }
};


module.exports = router;
