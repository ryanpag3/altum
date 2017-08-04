/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('lobbyController',
['$scope', '$location', '$http', '$q', '$routeParams', 'socket', 'AuthService',
  function($scope, $location, $http, $q, $routeParams, socket, AuthService) {
  $scope.lobbyId = $routeParams.lobbyId;
  $scope.messages = [];
  $scope.activeUsers = [];
  $scope.displaySocialMenu = false;

  socket.emit('join-room', $scope.lobbyId);
  socket.emit('get-lobby-members', $scope.lobbyId);

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

  // TODO refactor to use HTTP
  socket.on('join-lobby', function(data) {
    $scope.obj = {username: data.username, lobbyId: data.lobby};
  });

    socket.on('update-chat', function(message) {
      $scope.messages.push(message);
      $scope.$apply();
    });

    socket.on('update-user-list', function(data) {
      var usernames = data;
      var temp = [];
      for (var index in usernames) {
        temp.push({ name: usernames[index], showSocial: false });
      }
      $scope.activeUsers = temp;
      $scope.$apply();
    });

   $scope.showSocial = function(index) {
     $scope.activeUsers[index].displaySocialMenu = true;
   };
   $scope.hideSocial = function(index) {
     $scope.activeUsers[index].displaySocialMenu = false;
   };

}]);
