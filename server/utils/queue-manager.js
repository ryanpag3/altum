/**
 * Created by dev on 7/5/2017.
 */
var Game = require('../models/game.js');
var users = require('./users.js');
var lobbyManager = require('./lobby-manager.js');
var QUEUE_CHECK_INTERVAL_IN_MILLIS = 50;
var queues = {}; // holds all active queues
var queueManager = function () {
};

/**
 * Checks if the user currently already exists in the queue, and then either creates a new queue or enters into
 * an existing queue if not.
 * @param username: user id
 * @param queue: queue url
 * @returns {boolean} success or failure
 */
queueManager.prototype.add = function (username, queue) {
  if (this.existsInQueue(username, queue)) {
    return false;
  }
  // add user to queue
  if (queues[queue] === undefined) {
    queues[queue] = [username];
  } else {
    queues[queue].push(username);
  }
  // add queue to user's active queue list
  users.addActiveQueue(username, queue);
  return true;
};

/**
 * iterates through selected queue, if username is found, splice the user out of the queue
 * @param username: user id unique
 * @param queue: queue url
 * @returns {boolean} success or failure flag
 * todo: convert to promises
 */
queueManager.prototype.remove = function (username, queue) {
  for (var i = 0; i < queues[queue].length; i++) {
    if (queues[queue][i] === username) {
      queues[queue].splice(i, 1);
      console.log(username + ' has been removed from ' + queue);
      users.removeActiveQueue(username, queue); // remove from user's active list
      return true;
    }
  }
  console.log('user does not exist in the selected queue');
  return false;
};

/*
 Iterate through user's activeQueues list. Use the names of each queue to access
 global queue object, check each queue to remove user.
 */
/**
 * iterate through user's active queue array. Iterates through each active queue. If username is found, splice out.
 * @param username: unique user id
 * @returns {boolean} success or failure flag
 * todo: convert boolean return to promises
 */
queueManager.prototype.removeAll = function (username) {
  var user = users.map[username];
  // save length of activeQueues to avoid for loop exiting early
  // .slice() copies array by value, otherwise reference will be copied
  var activeQueues = user.activeQueues;
  for (var i = 0; i < activeQueues.length; i++) {
    var qName = activeQueues[i];
    for (var k = 0; k < queues[qName].length; k++) {
      if (queues[qName][k] === username) {
        queues[qName].splice(k, 1); // remove element at k
      }
    }
  }
  users.removeAllActiveQueues(username);
  // returns true if user has been removed from all active queues
  return users.map[username].activeQueues.length === 0;
};

/**
 * checks whether a user exists in a specified queue
 * @param username: unique user id
 * @param queue: queue url
 * @returns {boolean} exists in queue
 * todo: convert to promises
 */
queueManager.prototype.existsInQueue = function (username, queue) {
  var queues = users.map[username].activeQueues;
  for (var i = 0; i < queues.length; i++) {
    if (queue === queues[i]) {
      return true;
    }
  }
  return false;
};

/**
 * This is the main iterative service, that checks each active queue at a set interval, and pushes users into temporary
 * arrays which then get passed to the lobby manager utility for creating a lobby.
 * 'short_name': qName.substr(0, qName.indexOf('_'))
 */
// 'short_name': qName.substr(0, qName.indexOf('_'))
  var startService = function () {
    for (var qName in queues) {
      // grab lobby_size from queue url, which is the first element separated by _
      var LOBBY_SIZE = 1;//qName.substr(0, qName.indexOf('_'));
      // var LOBBY_SIZE = 1; for debugging
      if (queues[qName].length >= LOBBY_SIZE) {
        var lobbyMembers = [];
        for (var i = 0; i < LOBBY_SIZE; i++) {
          lobbyMembers.push(queues[qName].shift());
        }
        lobbyManager.createLobby(lobbyMembers);

      }
    }

};
setInterval(startService, QUEUE_CHECK_INTERVAL_IN_MILLIS);

/**
 * Iterative service which scans the queue list and removes the queue if empty.
 */
var queueGarbageCollector = function () {
  for (var qName in queues) {
    if (queues[qName].length === 0) {
      console.log('deleting ' + qName);
      delete queues[qName];
    }
  }
};
setInterval(queueGarbageCollector, 100);

module.exports = new queueManager();


