/**
 * Created by dev on 6/22/2017.
 */
var queueService = require('../routes/queue');
var users = require('./users');

var socket = function(io) {
  io.on('connection', function(socket) {
    socket.on('add-user', function(username) {
      users.create(username, socket);
      console.log(username + ' has been added to the user map.');
      console.log('# of users: ' + Object.keys(users.map).length);
    });

    socket.on('delete-user', function(username) {
      console.log('username: ' + username);
      users.delete(username);
      console.log(username + ' has been removed from user pool.');
      console.log('# of users ' + Object.keys(users.map).length);
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
