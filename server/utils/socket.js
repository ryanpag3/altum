/**
 * Created by dev on 6/22/2017.
 */
var queueService = new (require('./queue'));
var userModule = require('./users');

var socket = function(io) {
  io.on('connection', function(socket) {
    function User(username) {
      this.username = username;
      this.lobby = null; // lobby ID
      this.activeQueues = []; // used to avoid iterating through queues to find users
                              // added on socket call and deleted when either:
                              // 1. removed from queue/queues
                              // 2. added to new lobby
      this.disconnected = false;
      this.socket = socket;
    }

    socket.on('add-user', function(username) {
      userModule.users[username] = new User(username);
      console.log('username: ' + userModule.users[username].username);
      console.log('# of users: ' + Object.keys(userModule.users).length);
    });

    socket.on('delete-user', function(username) {
      console.log('username: ' + username);
      delete users[username];
      console.log(username + ' has been removed from user pool.');
      console.log('# of users ' + Object.keys(users).length);
    });

    socket.on('join-room', function(room) {
      console.log(room + ' joined.');
      socket.join(room);
    });

    socket.on('send-message', function(data) {
      var currTime = getCurrentTime();
      var msg = currTime + ' ' + data.username + ': ' + data.message;
      io.to(data.room).emit('update-chat', msg);
    });

    socket.on('join-queue', function(data) {
      queueService.addToQueue(data.username, data.queue);
    });

    socket.on('add-to-lobby', function(data){

    });
  });
};

/**
 * Helper Functions
 */

function existsInQueue(username, queue) {
  // returns true if user is in 'queue'
}

function existsInLobby(username) {
  // returns true if user is in a lobby
}

function getCurrentTime() {
  var rawTime = new Date();
  return rawTime.getHours() + ':' + rawTime.getMinutes() + ':' + rawTime.getSeconds();
}



module.exports = socket;
