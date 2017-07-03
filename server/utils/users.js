/**
 * Created by dev on 6/27/2017.
 */
// anonymous object
var users = function () {};
var DISCONNECT_TIMEOUT_IN_MILLIS = 5000;

// private constructor
function User(username, socket) {
      this.username = username;
      this.lobby = null; // lobby ID
      this.activeQueues = []; // used to avoid iterating through queues to find users
                              // added on sockets call and deleted when either:
                              // 1. removed from queue/queues
                              // 2. added to new lobby
      this.disconnected = false;
      this.sockets = [socket];

      this.existsInQueue = function (queue) {
        for (var i = 0; i < this.activeQueues.length; i++) {
          if (queue === this.activeQueues[i]) {
            return true;
          }
        }
        return false;
      };

};

// holds user info by key
users.prototype.map = {};

// expose constructor
users.prototype.create = function(username, socket) {
  if (users.prototype.map[username] !== undefined) {
    // add sockets to existing user object
    console.log(username + ' already exists in user map, adding socket to sockets array.');
    users.prototype.map[username].sockets.push(socket);
    users.prototype.map[username].disconnected = false;
  } else {
    users.prototype.map[username] = new User(username, socket);
    var i = Array(24).join('*');
    console.log(i);
    console.log(username + ' has been added to the user map.');
    console.log('# of users: ' + Object.keys(users.prototype.map).length);
    console.log(i);
  }
};

// check if user exists
// check if multiple sockets exist
// if
users.prototype.delete = function(username, socket) {
  var user = users.prototype.map[username];
  if (users.prototype.map[username] !== undefined) {
    if (users.prototype.map[username].sockets.length > 1) {
      console.log('background tab detected, not deleting user');
      users.prototype.map[username].disconnected = false;
      removeSocket(username, socket);
    } else {
      users.prototype.map[username].disconnected = true;
    }

    setTimeout(function() {
      // if user is still authenticated
      if (user.disconnected === true) {
        delete users.prototype.map[username];
        console.log(username + ' has been removed from the usermap.');
      }
    }, DISCONNECT_TIMEOUT_IN_MILLIS);
  }  else {
    console.log('user does not exist in system.');
  }
};

users.prototype.addActiveQueue = function(username, queue) {
  users.prototype.map[username].activeQueues.push(queue);
};

users.prototype.removeActiveQueue = function(username, queue) {
  for (var i = 0; i < users.prototype.map[username].activeQueues.length; i++) {
    if (users.prototype.map[username].activeQueues[i] === queue) {
      users.prototype.map[username].activeQueues.splice(i, 1);
    }
  }
};

// helper functions
function removeSocket(username, socket) {
  var sockets = users.prototype.map[username].sockets;
  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i] === socket) {
      sockets.splice(i, 1);
      users.prototype.map[username].sockets = sockets;
    }
  }
}

module.exports = new users();
