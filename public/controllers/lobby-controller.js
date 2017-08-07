/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('lobbyController',
  ['$scope', '$location', '$http', '$q', '$routeParams', 'socket', 'AuthService',
    function ($scope, $location, $http, $q, $routeParams, socket, AuthService) {
      $scope.lobbyId = $routeParams.lobbyId; // lobby id of current lobby
      $scope.messages = []; // current messages in lobby chat
      $scope.activeUsers = []; // connected user information
      $scope.displaySocialMenu = false; // ng-show for social menu

      // emit join-room to server
      socket.emit('join-room', $scope.lobbyId);
      // request connected user information for the current lobby by lobbyId
      socket.emit('get-lobby-members', $scope.lobbyId);

      /**
       * Checks that user chat messages are not empty or null and alerts the user if it is. Confirms
       * the user's authentication status with the authentication service, then sends a socket emit to
       * the server with the message data.
       */
      $scope.sendMessage = function () {
        if ($scope.text === null || $scope.text === "" || $scope.text === undefined) {
          alert('empty messages are not allowed.');
        } else {
          AuthService.getUserStatus()
            .then(function (response) {
              var data = {room: $scope.lobbyId, username: response.username, content: $scope.text};
              socket.emit('send-message', data);
              $scope.text = null;
            });
        }
      };

      /**
       * When the server emits update-chat to the client, we push the message to the messages array and issue a
       * scope apply() call to update.
       */
      socket.on('update-chat', function (message) {
        $scope.messages.push(message);
        $scope.$apply();
      });

      /**
       * When a new user connects, the server will emit an update-user-list socket. This contains the username and
       * social information in an object. We format that information into a new array to include a boolean for handling
       * displaying and hiding social information for each user and assign it to the activerUsers scope variable, and
       * issue a scope.apply to force an ui update.
       */
      socket.on('update-user-list', function (data) {
        var usernames = data;
        var temp = [];
        for (var index in usernames) {
          temp.push({name: usernames[index], showSocial: false});
        }
        $scope.activeUsers = temp;
        $scope.$apply();
      });

      /**
       * toggles the visibility of a lobby member's social link information.
       * @param index: index of user in activeUsers array
       */
      $scope.toggleSocial = function(index) {
        $scope.activeUsers[index].displaySocialMenu = !$scope.activeUsers[index].displaySocialMenu;
      };
    }]);
