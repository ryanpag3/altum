/**
 * Created by dev on 6/27/2017.
 */
// anonymous object
var users = function () {};
var DISCONNECT_TIMEOUT_IN_MILLIS = 5000;

// private constructor
function User(username, socket) {
      this.username = username;
      this.lobby; // lobby ID
      this.activeQueues = []; // used to avoid iterating through queues to find users
                              // added on sockets call and deleted when either:
                              // 1. removed from queue/queues
                              // 2. added to new lobby
      this.disconnected = false;
      this.sockets = [socket];
};

// holds user info by key
users.prototype.map = {};

// expose constructor
users.prototype.create = function(username, socket) {

  if (users.prototype.map[username] !== undefined) {
    // add sockets to existing user object
    console.log(username + ' already exists in user map, adding socket to sockets array.');
    users.prototype.map[username].sockets.push(socket);
    // if user is already in a lobby
    // TODO maybe check if lobbies.users contains this username?
    if (users.prototype.map[username].lobby !== undefined) {
      console.log('User is already in a lobby, reconnecting...');
      console.log('lobby info: ' + users.prototype.map[username].lobby);
      socket.emit('lobby-found');
      for (var i = 0; i < users.prototype.map[username].sockets.length; i++) {
        var socket = users.prototype.map[username].sockets[i];
        socket.emit('lobby-found');
      }
      // if user is currently active in queue(s)
    } else if (users.prototype.map[username].activeQueues.length !== 0) {
      console.log(username + ' has an active queue list > 0, restarting timer');
      socket.emit('display-queue-timer');
      // display queue timer
    }
    console.log(username + ' has ' + users.prototype.map[username].sockets.length + ' sockets.');
    users.prototype.map[username].disconnected = false;
  } else {
    users.prototype.map[username] = new User(username, socket);
    var i = new Array(24).join('*');
    console.log(i);
    console.log(username + ' has been added to the user map.');
    console.log('# of users: ' + Object.keys(users.prototype.map).length);
    console.log(i);
  }
};

/**
  First, checks if user with given username exists in the user map. Second,
  removes disconnected socket from user object. If the user sockets now
  equal 0, we know that the user is disconnect, and can safely delete them
  from the user map.
 */
users.prototype.delete = function(username, socket) {
  //  check if user exists
  if (users.prototype.map[username] !== undefined) {
    // check if socket exists to delete
    if (users.prototype.map[username].sockets.includes(socket)) {
      console.log(username + ' has disconnected a tab.');
      removeSocket(username, socket);
    }

    if (users.prototype.map[username].sockets.length === 0) {
      setTimeout(function () {
        // if user has not reconnected
        if (users.prototype.map[username].sockets.length === 0) {
          delete users.prototype.map[username];
          console.log(username + ' has been removed from the user map.');
        } else {
          console.log(username + ' has reconnected in time.');
        }
      }, DISCONNECT_TIMEOUT_IN_MILLIS);
    }
  } else {
    console.log(username + ' does not exist in user map. :(');
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

users.prototype.removeAllActiveQueues = function(username) {
  users.prototype.map[username].activeQueues = [];
  console.log(username + ' has ' + users.prototype.map[username].activeQueues.length + ' active queues.');
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
