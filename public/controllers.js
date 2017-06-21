/**
 * Created by dev on 6/21/2017.
 */
angular.module('angulobby').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.login = function() {
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function (err) {
          $scope.error = true;
          $scope.errorMessage = err;
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    }
  }]);

angular.module('angulobby').controller('logoutController',
['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.logout = function() {
      AuthService.logout()
        .then(function() {
          $location.path('/login');
        });
    };
  }]);

angular.module('angulobby').controller('registerController',
['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function(){
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
      // handle error
        .catch(function(err){
          $scope.error = true;
          $scope.errorMessage = err;
          $scope.disabled = false;
          $scope.registerForm = {};
        })
    };
  }]);
