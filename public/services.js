/**
 * Created by dev on 6/20/2017.
 */
// service named AuthService
// injected the dependencies that will be used
// $q, $timeout, $http
angular.module('angulobby').factory('AuthService',
  ['$q', '$timeout', '$http',
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
        return $http.get('/user/status')
          .then(function (response) {
            // status returns true if user is authenticated
            if (response.data.msg) {
              user = true;
            } else {
              user = false;
            }
          })
          .catch(function (data) {
            user = false;
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
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject(response.data.msg);
            }
          })
          .catch(function (response) {
            user = false;
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
            user = false;
            deferred.resolve();
          })
          .catch(function (response) {
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

