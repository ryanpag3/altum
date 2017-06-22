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
      io.to(data.room).emit('update-chat', data.message);
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
