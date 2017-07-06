/**
 * Created by dev on 7/5/2017.
 */
module.exports = function(io) {
  this.on = function(socket, event, callback) {
    socket.on(event, callback);
  };

  this.emit = function(event, callback) {
    io.emit(event, callback);
  };

};
