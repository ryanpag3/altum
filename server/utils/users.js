/**
 * Created by dev on 6/27/2017.
 */
// anonymous object
var users = function () {};

// private constructor
function User(username, socket) {
      this.username = username;
      this.lobby = null; // lobby ID
      this.activeQueues = []; // used to avoid iterating through queues to find users
                              // added on socket call and deleted when either:
                              // 1. removed from queue/queues
                              // 2. added to new lobby
      this.disconnected = false;
      this.socket = socket;
}

// holds user info by key
users.prototype.map = {};

// expose constructor
users.prototype.create = function(username, socket) {
  users.prototype.map[username] = new User(username, socket);
};

users.prototype.delete = function(username) {
  if (users.prototype.map[username] !== undefined) {
    delete users.prototype.map[username];
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

module.exports = new users();
