/**
 * Created by dev on 6/22/2017.
 */
var socket = function(io) {
  io.on('connection', function(socket) {
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
