var app = angular.module('angulobby', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.

    when('/', {
      templateUrl: 'pages/home.html',
      controller: 'IndexController'
    }).

    when('/about', {
      templateUrl: 'pages/about.html',
      controller: 'IndexController'
    }).

    when('/contact', {
      templateUrl: 'pages/contact.html',
      controller: 'IndexController'
    });

  $locationProvider.html5Mode(true);

}]);

app.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io();

  return {
    on: function (eventName, callback) {
      socket.on(eventName, callback);
    },
    emit: function (eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);

app.controller('IndexController', function ($scope, socket) {
  $scope.alert = function () {
    console.log('emitting test alert call');
    socket.emit('test');
  };

  socket.on('test', function () {
    console.log('test called');
    alert('test message');
  });

});
