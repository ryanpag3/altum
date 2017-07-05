/**
 * Created by dev on 7/5/2017.
 */
/**
 *
 */
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
