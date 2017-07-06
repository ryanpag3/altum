/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('lobbyController',
['$scope', '$location', '$http', '$q', 'socket', function($scope, $location, $http, $q, socket) {

  // TODO refactor to use HTTP
  socket.on('join-lobby', function(data) {
    console.log('lobbyController socket fired. username: ' + data.username + ' ' + data.lobby);
    $scope.obj = {username: data.username, lobbyId: data.lobby};
    // console.log($scope.username);
    // console.log($scope.lobbyId);
  });

}]);
