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
/**
 * this utility method handles adding a user to the connected user map, as well as associating multiple user
 * tabs with the same user id.
 * @param username: unique id
 * @param socket: websocket address
 */
users.prototype.create = function(username, socket) {

  if (users.prototype.map[username] !== undefined) {
    // add sockets to existing user object
    users.prototype.map[username].sockets.push(socket);
    // if user is already in a lobby
    if (users.prototype.map[username].lobby !== undefined) {
      socket.emit('lobby-found');
      // associate all secondary tabs with lobby found
      for (var i = 0; i < users.prototype.map[username].sockets.length; i++) {
        var socket = users.prototype.map[username].sockets[i];
        socket.emit('lobby-found');
      }
    }
    // if user is currently active in queue(s)
    else if (users.prototype.map[username].activeQueues.length !== 0) {
      console.log(username + ' has an active queue list > 0, restarting timer');
      socket.emit('display-queue-timer');
    }
    // define user as connected
    users.prototype.map[username].disconnected = false;
  } else {
    // create new user object
    users.prototype.map[username] = new User(username, socket);
  }
};

/**
  First, checks if user with given username exists in the user map. Second,
  removes disconnected socket from user object. If the user sockets now
  equal 0, we know that the user is disconnect, and can safely delete them
  from the user map.
 */
/**
 * checks if the user exists in the user map, removes disconnected socket from user object. If the user sockets are now
 * 0 length, we delete them from the user map and add them to the delete buffer.
 * @param username: unique id
 * @param socket: websocket
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

/**
 * associates a queue with a user
 * @param username
 * @param queue
 */
users.prototype.addActiveQueue = function(username, queue) {
  users.prototype.map[username].activeQueues.push(queue);
};

/**
 * disassociates a queue with a user
 * @param username
 * @param queue
 */
users.prototype.removeActiveQueue = function(username, queue) {
  for (var i = 0; i < users.prototype.map[username].activeQueues.length; i++) {
    if (users.prototype.map[username].activeQueues[i] === queue) {
      users.prototype.map[username].activeQueues.splice(i, 1);
    }
  }
};

/**
 * disassociates all queues with a user
 * @param username
 */
users.prototype.removeAllActiveQueues = function(username) {
  users.prototype.map[username].activeQueues = [];
  console.log(username + ' has ' + users.prototype.map[username].activeQueues.length + ' active queues.');
};

/** HELPER FUNCTIONS **/
/**
 * removes a socket from a specified user object
 * @param username
 * @param socket
 */
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
