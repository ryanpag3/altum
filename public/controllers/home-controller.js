/**
 * ** HOME CONTROLLER **
 * This manipulates the DOM for the home.html partial page.
 */
angular.module('angulobby').controller('homeController',
  ['$scope', '$location', 'socket', 'AuthService',
  function($scope, $location, socket, AuthService) {
    $scope.messages = []; // global chat messages
    $scope.text = null; // global chat text
    $scope.displayParamWindow = false; // ng-show variable for the queue parameter window
    $scope.displayBtnContainer = true; // ng-show variable for hiding and showing queue buttons
    socket.emit('join-room', 'global'); // alerts the server that this client wants to join global chat

    /**
     * Toggles menu buttons
     */
    // $scope.toggleMenu = function() {
    //   $scope.displayBtnContainer = !$scope.displayBtnContainer;
    // };

    /**
     * Toggles parameter window
     */
    $scope.toggleParamWindow = function() {
      $scope.displayParamWindow = !$scope.displayParamWindow;
    };

    /**
     * Toggles queue timer
     */
    $scope.toggleTimer = function() {
      $scope.displayQueueTimer = !$scope.displayQueueTimer;
    };


    /**
     * Checks to make sure that a user's message is not empty. If it is empty, it alerts the user
     * that empty messages aren't allowed. Grabs current authentication status from the AuthService
     * and then sends a socket emit to the server with the message content of the user. Logs error
     * error message if thrown by service.
     */
    $scope.sendMessage = function () {
      if ($scope.text === null || $scope.text === "" || $scope.text === undefined) {
        alert('empty messages are not allowed.');
      } else {
        AuthService.getUserStatus()
          .then(function (response) {
            var data = {room: 'global', username: response.username, content: $scope.text};
            socket.emit('send-message', data);
            $scope.text = null;
          })
          .catch(function(response) {
            // catch err
            console.log(response);
          });
      }
    };

    /**
     * When the server emits update-chat, pushes chat data to messages array.
     */
    socket.on('update-chat', function(data) {
        $scope.messages.push(data);
        $scope.$apply();
    });

    /**
     * When the server emits lobby-found, routes user to lobby screen and
     * appends lobbyId to url.
     */
    socket.on('lobby-found', function(data) {
      var lobbyId = data.lobby;
      $location.path('/lobby/' + lobbyId);
      $scope.$apply();
    });
  }]);
