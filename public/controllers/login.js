/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('loginController',
  ['$scope', '$location', 'AuthService', 'socket',
  function ($scope, $location, AuthService, socket) {
    $scope.login = function() {
      // initial values
      $scope.error = false; // error thrown
      $scope.disabled = true; // button disabled

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          socket.emit('add-user', $scope.loginForm.username);
          $scope.loginForm = {};
        })
        // handle error
        .catch(function (err) {
          $scope.error = true;
          $scope.errorMessage = err;
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };

    $scope.register = function() {
      $location.path('/register');
    };
  }]);
