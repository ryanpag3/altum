/**
 * Created by dev on 7/5/2017.
 */
/**
 * loginController calls the AuthService.logout function
 * and sets the page to the login on success.
 */
angular.module('angulobby').controller('logoutController',
['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    /**
     * Issues a logout command to the authentication service, and routes the user to the login page.
     */
    $scope.logout = function() {
      AuthService.logout()
        .then(function() {
          $location.path('/login');
        });
    };
  }]);
