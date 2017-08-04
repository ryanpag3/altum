/**
 * Created by dev on 7/5/2017.
 */
var app = angular.module('angulobby');
app.factory('AuthService',
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
        getCurrentUser: function () {
          return currentUser;
        },
      });
      function isLoggedIn() {
        if (userAuthenticated) {
          return true;
        } else {
          return false;
        }
      }

      function getUserStatus() {
        var deferred = $q.defer();
        $http.get('/user/status')
          .then(function (response) {
            if (response.status === 200 && response.data.isAuthenticated) {
              currentUser = response.data.username;
              deferred.resolve(response.data);
            } else {
              deferred.resolve(response.data);
            }
          })
          .catch(function (response) {
            userAuthenticated = false;
            deferred.reject(response.data);
          });

        return deferred.promise;
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

      function register(username, password, email, steam_id, playstation_id, xbox_id, nintendo_id, blizzard_id) {
        // create new instance of deferred
        var deferred = $q.defer();

        // send POST request to the server
        $http.post('/user/register',
          {username: username, password: password, email: email, steam_id: steam_id, playstation_id: playstation_id,
          xbox_id: xbox_id, nintendo_id: nintendo_id, blizzard_id: blizzard_id})
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

      /*
        Attempts to query the authentication API for the
        authenticated user object. If the API returns a
        status code of 200, then we pass that information
        to the client. If it returns a status code of 500,
        we pass an error message.
       */
      function getUserInfo() {
        var deferred = $q.defer();

        $http.get('/info')
          .then (function(res) {
            deferred.resolve(res.data.user);
          })
          .catch(function(res) {
            deferred.reject(res.data.msg);
          });
        return deferred.promise;
      }
    }]);
