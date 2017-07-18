/**
 * Created by dev on 7/6/2017.
 */
var lobbyManager = function() {};
var users = require('./users');
var lobbies = {}; // holds all lobby info

//for querying db
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/angulobby";

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
  var lobbyId = createLobbyId(16);

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
    }
  }
};

lobbyManager.prototype.getUsers = function(lobbyId) {
  // TODO
  // use users array to query mongoDB and access social links
  MongoClient.connect(url, function (err, db){
    if(err) throw err;
    for(var i = 0; i < lobbies[lobbyId].users.length; ++i) {
      console.log("Querying database for " + lobbies[lobbyId].users[i] + "'s information");

      var query = {username: lobbies[lobbyId].users[i]};
      var filter = {_id : 0, username : 1, steam_id : 1, playstation_id: 1, xbox_id : 1, nintendo_id : 1, blizzard_id : 1}
      db.collection("users").find(query, filter).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);

      });
    }
  });

  return lobbies[lobbyId].users;
  //create a new obj array username, image, [links]
};

/*
  Helper Functions
 */

function createLobbyId(len) {
  var length = len;
  var text = "";
  var potential = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    text += potential.charAt(Math.floor(Math.random() * potential.length));
  }
  return text;
}


module.exports = new lobbyManager();
