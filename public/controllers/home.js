/**
 * Created by dev on 7/5/2017.
 */
/**
 *
 */
angular.module('angulobby').controller('homeController',
  ['$scope', 'socket', 'AuthService',
  function($scope, socket, AuthService) {
    $scope.messages = [];
    $scope.text = null;
    $scope.displayParamWindow = false;
    socket.emit('join-room', 'home'); // join global chat

    $scope.hideParamWindow = function() {
      $scope.displayParamWindow = false;
    };

    $scope.showParamWindow = function() {
      $scope.displayParamWindow = true;
    };

    $scope.hideQueueTimer = function() {
      console.log('Hiding queue timer...');
      $scope.displayQueueTimer = false;
    };

    $scope.showQueueTimer = function() {
      console.log('show queue timer called');
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

    $scope.leaveQueues = function() {
      QueueService.removeFromAllQueues(AuthService.getCurrentUser())
        .then(
          // handle success
          // TODO
        )
        .catch(function(err) {
        // handle failure
          // TODO
        });
    };

    $scope.sendMessage = function () {
      if ($scope.text === null || $scope.text === "" || $scope.text === undefined) {
        console.log('empty messages are not allowed.');
      } else {
        AuthService.getUserStatus()
          .then(function (response) {
            var data = {room: 'home', username: response.username, message: $scope.text};
            socket.emit('send-message', data);
            $scope.text = null;
          });
      }
    };

    socket.on('update-chat', function(message) {
        $scope.messages.push(message);
        $scope.$apply();
    });
  }]);
