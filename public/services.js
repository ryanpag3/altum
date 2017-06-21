/**
 * Created by dev on 6/20/2017.
 */
// service named AuthService
// injected the dependencies that will be used
// $q, $timeout, $http
angular.module('angulobby').factory('AuthService',
  [$q, $timeout, $http,
    function ($q, $timeout, $http) {
      var user = null;
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
      });
      function isLoggedIn() {
        if (user) {
          return true;
        } else {
          return false;
        }
      }

      function getUserStatus() {
        return $http.get('/status')
          .success(function (data) {
            // status returns true if user is authenticated
            if (data.status) {
              user = true;
            } else {
              user = false;
            }
          })
          .error(function (data) {
            user = false;
          });
      }

      function login(username, password) {
        // create a new instance of deferred
        // see: https://code.angularjs.org/1.4.9/docs/api/ng/service/$q
        var deferred = $q.defer();

        // send a POST request to the server
        $http.post('/login',
          {username: username, password: password})
        // handle success
          .success(function (data, status) {
            if (status === 200 && data.status) {
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })
          .error(function (data) {
            user = false;
            deferred.rejest();
          });
        // return promise object
        return deferred.promise;
      }

      function logout() {
        // create new instance of deferred
        var deferred = $q.defer();

        // send a GET request to the server
        $http.get('/logout')
          .success(function (data) {
            user = false;
            deferred.resolve();
          })
          .error(function (data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }

      function register(username, password) {
        // create new instance of deferred
        var deferred = $q.defer();

        // send POST request to the server
        $http.post('/register.html',
          {username: username, password: password})
          // handle success case
          .success(function (data, status) {
            if (status === 200 && data.status) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }
    }]);

