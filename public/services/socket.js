/**
 * Created by dev on 7/5/2017.
 */
var app = angular.module('angulobby');
app.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io();

  return {
    on: function (eventName, callback) {
      socket.on(eventName, callback);
    },
    emit: function (eventName, data) {
      socket.emit(eventName, data);
    },
  };
}]);
