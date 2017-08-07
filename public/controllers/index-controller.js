/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('indexController',
['$scope', '$http', 'AuthService', 'socket', function( $scope, $http, AuthService, socket) {
  /**
   * For every page request that the index-controller is initialized, we get the current user's
   * authentication status, and if they are authenticated we add their socket to the socket map.
   */
  var init = function() {
    AuthService.getUserStatus()
      .then(function(response) {
        if (response.isAuthenticated) {
          // add user to user map, if user already exists, add socket
          socket.emit('add-user', response.username);
        }
      })
      .catch(function(response) {
        // todo: handle error message thrown by authentication service
      });
  };
  // start
  init();
}]);
