/**
 * Created by dev on 6/20/2017.
 */
// service named AuthService
// injected the dependencies that will be used
// $q, $timeout, $http
angular.module('angulobby').factory('AuthService',
  ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
      var userAuthenticated = null;
      // current session username
      var currentUser = null;
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register,
        getCurrentUser: function() {
          return currentUser; }
      });
      function isLoggedIn() {
        if (userAuthenticated) {
          return true;
        } else {
          return false;
        }
      }

      function getUserStatus() {
        return $http.get('/user/status')
          .then(function (response) {
            // status returns true if user is authenticated
            if (response.data.isAuthenticated) {
              userAuthenticated = true;
              currentUser = response.data.username;
            } else {
              userAuthenticated = false;
            }
          })
          .catch(function (data) {
            userAuthenticated = false;
          });
      }

      function login(username, password) {
        // create a new instance of deferred
        // see: https://code.angularjs.org/1.4.9/docs/api/ng/service/$q
        var deferred = $q.defer();

        // send a POST request to the server
        $http.post('/user/login',
          {username: username, password: password})
          // handle success
          .then(function (response) {
            if (response.status === 200 && response.data.msg) {
              userAuthenticated = true;
              currentUser = username;
              deferred.resolve();
            } else {
              userAuthenticated = false;
              deferred.reject(response.data.msg);
            }
          })
          .catch(function (response) {
            userAuthenticated = false;
            deferred.reject(response.data.msg);
          });
        // return promise object
        return deferred.promise;
      }

      function logout() {
        // create new instance of deferred
        var deferred = $q.defer();

        // send a GET request to the server
        $http.get('/user/logout')
          .then(function (response) {
            userAuthenticated = false;
            currentUser = null;
            deferred.resolve();
          })
          .catch(function (response) {
            userAuthenticated = false;
            currentUser = null;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }

      function register(username, password) {
        // create new instance of deferred
        var deferred = $q.defer();

        // send POST request to the server
        $http.post('/user/register',
          {username: username, password: password})
          // handle success case
          .then(function (response) {
            if (response.status === 200 && response.data.msg) {
              deferred.resolve();
            } else {
              deferred.reject(response.data.msg);
            }
          })
          // handle error
          .catch(function (response) {
            deferred.reject(response.data.msg);
          });

        // return promise object
        return deferred.promise;
      }
    }]);

app.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io();

  return {
    on: function (eventName, callback) {
      socket.on(eventName, callback);
    },
    emit: function (eventName, data) {
      socket.emit(eventName, data);
    },
    emitTo: function(room, eventName, data) {
      socket.to(room).emit(eventName, data);
    }

  };
}]);

app.factory('QueueService', [
  '$http', '$q',
    function($http, $q) {
      return ({
        addToQueue: addToQueue,
        removeFromQueue: removeFromQueue,
        removeFromAllQueues: removeFromAllQueues
      });

      function addToQueue(username, queue) {
        var deferred = $q.defer();
        $http.post('/queue/add', {username: username, queue: queue})
          .then(function(res) {
            if (res.status === 200) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          .catch( function(res) {
            deferred.reject();
          });
        return deferred.promise;
      }

      function removeFromQueue(username, queue) {
        var deferred = $q.defer();
        $http.post('/queue/remove', {username: username, queue: queue})
          .then(function(res) {
            if (res.status === 200) {
              deferred.resolve(res.data.msg);
            } else {
              deferred.reject();
            }
          })
          .catch(function(res) {
            deferred.reject(res.data.msg);
          });
        return deferred.promise;
      }

      function removeFromAllQueues(username) {
        var deferred = $q.defer();
        $http.post('/queue/remove-all', { username: username })
          .then(function(res) {
            if (res.status === 200) {
              deferred.resolve(res.data.msg);
            } else {
              deferred.reject();
            }
          })
          .catch(function(res) {
            deferred.reject(res.data.msg);
          });
        return deferred.promise;
      }
  }]);
