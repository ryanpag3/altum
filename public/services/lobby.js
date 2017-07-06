/**
 * Created by dev on 7/5/2017.
 */
var app = angular.module('angulobby');
app.factory('lobbyService', [
  '$scope', '$http', '$q', 'socket',
  function($scope, $http, $q, socket) {


    return ({
      joinLobby: joinLobby,
      leaveLobby: leaveLobby
    });



    function joinLobby() {
      // TODO
    }

    function leaveLobby() {
      //  TODO
    }
  }
]);
