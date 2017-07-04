/**
 * Created by dev on 6/22/2017.
 */
var queueService = require('../routes/queue');
var users = require('./users');

var socket = function(io) {
  var username;
  io.on('connection', function(socket) {
    socket.on('add-user', function(name) {
      users.create(name, socket);
      username = name;
    });

    socket.on('delete-user', function(name) {
      console.log('username: ' + name);
      users.delete(name);
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

    socket.on('disconnect', function() {
      users.delete(username, socket);
    });
  });
};

/**
 * Helper Functions
 */

function getCurrentTime() {
  var rawTime = new Date();
  return rawTime.getHours() + ':' + rawTime.getMinutes() + ':' + rawTime.getSeconds();
}



module.exports = socket;
