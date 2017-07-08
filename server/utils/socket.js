/**
 * Created by dev on 6/22/2017.
 */
var users = require('./users');
var lobbyManager = require('./lobby-manager');

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

    socket.on('get-lobby-members', function(lobbyId) {
      console.log('get-lobby-members socket fired');
      var users = lobbyManager.getUsers(lobbyId);
      io.to(lobbyId).emit('update-user-list', users);
    })
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
