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

    socket.on('send-message', function(message) {
      var room = message.room;
      var currTime = getCurrentTime();
      var msg = { time: currTime, username: message.username, content: message.content };
      io.to(room).emit('update-chat', msg);
    });

    socket.on('disconnect', function() {
      console.log('socket disconnect called');
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
  var hours = rawTime.getHours() > 9 ? rawTime.getHours() : '0' + rawTime.getHours();
  var minutes = rawTime.getMinutes() > 9 ? rawTime.getMinutes() : '0' + rawTime.getMinutes();
  var seconds = rawTime.getSeconds() > 9 ? rawTime.getSeconds() : '0' + rawTime.getSeconds();
  return hours + ':' + minutes + ':' + seconds;

}



module.exports = socket;
