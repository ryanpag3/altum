/**
 * Created by dev on 7/5/2017.
 */
/**
 *
 */
angular.module('angulobby').controller('homeController',
  ['$scope', '$location', 'socket', 'AuthService',
  function($scope, $location, socket, AuthService) {
    $scope.messages = [];
    $scope.text = null;
    $scope.displayParamWindow = false;
    socket.emit('join-room', 'global'); // join global chat


    $scope.hideParamWindow = function() {
      $scope.displayParamWindow = false;
    };

    $scope.showParamWindow = function() {
      $scope.displayParamWindow = true;
    };

    $scope.hideQueueTimer = function() {
      $scope.displayQueueTimer = false;
    };

    $scope.showQueueTimer = function() {
      $scope.displayQueueTimer = true;
    };

    $scope.joinQueue = function() {
      $scope.displayParamWindow = false;
      $scope.displayQueueTimer = true;
    };

    $scope.cancelParamSelect = function() {
      $scope.displayParamWindow = false;
    };

    $scope.setQueueParams = function() {
      $scope.displayParamWindow = true;
    };

    $scope.sendMessage = function () {
      if ($scope.text === null || $scope.text === "" || $scope.text === undefined) {
        console.log('empty messages are not allowed.');
      } else {
        AuthService.getUserStatus()
          .then(function (response) {
            var data = {room: 'global', username: response.username, message: $scope.text};
            socket.emit('send-message', data);
            $scope.text = null;
            console.log('send message fired.');
          })
          .catch(function(response) {
            console.log('error thrown by getUserStatus()');
            console.log(response);
          });
      }
    };

    socket.on('update-chat', function(message) {
        console.log('update chat fired');
        $scope.messages.push(message);
        $scope.$apply();
    });

    socket.on('lobby-found', function(data) {
      var lobbyId = data.lobby;
      $location.path('/lobby/' + lobbyId);
      $scope.$apply();
    });

    socket.on('display-queue-timer', function() {
      $scope.showQueueTimer();
    });
  }]);
