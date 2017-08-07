/**
 * Created by dev on 7/6/2017.
 */
var lobbyManager = function() {};
var users = require('./users');
var User = require('../models/user');
var lobbies = {}; // holds all lobby info
var Q = require('q');


//for querying db
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/angulobby";

/*function UserProfile(username, steam_id, playstation_id, xbox_id, blizzard_id, nintendo_id) {
  this.username = username;
  this.profile_pic;
  this.steam_id = steam_id;
  this.playstation_id = playstation_id;
  this.xbox_id = xbox_id;
  this.blizzard_id = blizzard_id;
  this.nintendo_id = nintendo_id;
}*/

/**
 * @param lobbyId: unique lobby identifier
 * @param lobbyMembers: lobby member user information
 * @constructor
 */
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

/**
 * returns user information for the specified lobby
 * @param lobbyId: unique lobby identifier
 * @returns {Array|Object} user information
 */
lobbyManager.prototype.getUsers = function(lobbyId, callback) {//callback variable
      var deferred = Q.defer();
      var users = lobbies[lobbyId].users;
      User.find({'username' : users},  {_id : 0, username : 1, steam_id : 1, playstation_id: 1, xbox_id : 1, nintendo_id : 1, blizzard_id : 1}
        , function(err, results) {
        // returns an array of user objects
        console.log(results);
        if(results)
          deferred.resolve(results);
        else
          deferred.reject("Problem resolving query");
      });
      return deferred.promise;




 // });
  // for(var i = 0; i < lobby_profiles_array.length; ++i)
  // {
  //   console.log(lobby_profiles_array[i].username,lobby_profiles_array[i].steam_id, lobby_profiles_array[i].playstation_id,
  //     lobby_profiles_array[i].xbox_id, lobby_profiles_array[i].nintendo_id, lobby_profiles_array[i].blizzard_id);
  //
  // }

  //create a new obj array username, image, [links]
};

/* HELPER FUNCTIONS */

/**
 * creates a unique lobby id
 * todo: handle potential collisions. This is like a 1/1000000 chance or something but wouldn't be good enough for prod
 * @param len: length of id to create
 * @returns {string} id
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
