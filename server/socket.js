/**
 * Created by dev on 6/22/2017.
 */
var socket = function(io) {
  io.on('connection', function(socket) {
    var users = {};
    function User(username) {
      this.username = username;
      // null if not in lobby
      // id if in lobby
      this.lobby = null;
      // if a user is in a queue, the name of the queue is here
      this.activeQueues = [];
      this.disconnected = false;

    }

  /**
     * receives the username and creates a user object
     * the user object is added to a map: users[username] = user object
     */
    socket.on('add-user', function(username) {
      users[username] = new User(username);
      console.log('username: ' + users[username].username);
      console.log('# of users: ' + Object.keys(users).length);
    });

    socket.on('delete-user', function(username) {
      console.log('username: ' + username);
      delete users[username];
      console.log('# of users ' + Object.keys(users).length);
    });

    socket.on('join-room', function(room) {
      console.log(room + ' joined.');
      socket.join(room);
    });

    socket.on('send-message', function(data) {
      console.log('attempting to send "' + data.message + '" to ' + data.room);
      var rawTime = new Date();
      var currTime = rawTime.getHours() + ':' +
          rawTime.getMinutes() + ':' +
          rawTime.getSeconds() + ' ';
      var msg = currTime + data.username + ': ' + data.message;
      io.to(data.room).emit('update-chat', msg);
    });
  });

  io.on('join-room', function(room){
    socket.join(room);
  });

  io.on('send-message', function(message) {
    console.log('message sent, updating chats');
  });
};

module.exports = socket;
