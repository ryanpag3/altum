/**
 * Created by dev on 7/5/2017.
 */
/**
 * loginController calls the AuthService.logout function
 * and sets the page to the login on success.
 */
angular.module('angulobby').controller('logoutController',
['$scope', '$location', 'AuthService', 'socket',
  function ($scope, $location, AuthService, socket) {
    $scope.logout = function() {
      var username = AuthService.getCurrentUser();
      AuthService.logout()
        .then(function() {
          $location.path('/login');
        });
    };
  }]);
