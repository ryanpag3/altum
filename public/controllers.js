/**
 * Created by dev on 6/21/2017.
 */
/**
 * Controllers are used to add behavior to the $scope object.
 * error: data-ng-show="error" sets <div> contents to {{errorMessage}}
 * disabled: boolean which controls visibility of login button
 *
 * loginController handles the transaction between the AuthService and the front-end
 * AuthService: service that handles the Ajax calls
 * location: current page
 * scope: current DOM scope, set by the data-ng-controller directive
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

/**
 * loginController calls the AuthService.logout function
 * and sets the page to the login on success.
 */
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

/**
 *
 */
angular.module('angulobby').controller('homeController',
  function($scope, socket, AuthService) {
    $scope.messages = [];
    $scope.text = null;
    socket.emit('join-room', 'home');

    $scope.sendMessage = function () {
      var data = {room: 'home', username: AuthService.getCurrentUser(), message: $scope.text };
      socket.emit('send-message', data);
      $scope.text = null;
    };

    socket.on('update-chat', function(message) {
        $scope.messages.push(message);
        $scope.$apply();
    });
  });
