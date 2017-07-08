/**
 * Created by dev on 7/6/2017.
 */
var lobbyManager = function() {};
var users = require('./users');
var lobbies = {}; // holds all lobby info

function Lobby(lobbyId, lobbyMembers) {
  this.lobbyId = lobbyId;
  this.users = lobbyMembers.slice(); // slice creates a copy of array
  console.log('lobby with id: ' + this.lobbyId + ' and users ' + users.toString() + ' created.');
}

/**
 * createLobby first creates a new lobby object and passes the
 * lobbyId and array of members to the constructor, and adds it to
 * the lobbies object by the lobbyId. It then iterates through the
 * lobbyMembers array and assigns the lobbyId to the user.lobby
 * for reference to the lobbies[lobbyId] object. Finally, it alerts
 * the lobby member's client that a lobby has been found, so that
 * the router can change the page.
 * @param lobbyMembers: array of usernames to be entered into lobby
 */
lobbyManager.prototype.createLobby = function(lobbyMembers) {
  // add queueManager per method to avoid circular dependency
  var queueManager = require('./queue-manager');
  var lobbyId = createLobbyId();

  // assign lobby object to map
  lobbies[lobbyId] = new Lobby(lobbyId, lobbyMembers);
  // assign lobbyId to user objects for reference to lobby map
  for (var i = 0; i < lobbyMembers.length; i++) {
    var username = lobbyMembers[i];
    // assign lobbyId to user object
    users.map[username].lobby = lobbyId;

    // remove user from all queues
    var success = queueManager.removeAll(username);
    console.log(username + ' has been assigned to lobby: ' + lobbyId);

    const userObj = users.map[lobbyMembers[i]];
    // alert all active sockets of user
    for (var k = 0; k < userObj.sockets.length; k++) {
      const socket = userObj.sockets[k];
      socket.emit('lobby-found', {lobby: lobbyId});
      setTimeout(function() { socket.emit('join-lobby', {username: userObj.username, lobby: lobbyId})}, 1000);
    }
  }
};

lobbyManager.prototype.joinLobby = function(username, lobbyId) {
 // TODO

};

lobbyManager.prototype.leaveLobby = function() {
  // TODO
};

lobbyManager.prototype.getUsers = function(lobbyId) {
  return lobbies[lobbyId].users;
};

/*
  Helper Functions
 */

function createLobbyId() {
  var length = 16;
  var text = "";
  var potential = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    text += potential.charAt(Math.floor(Math.random() * potential.length));
  }
  return text;
}


module.exports = new lobbyManager();
