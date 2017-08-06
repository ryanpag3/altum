/**
 * Created by dev on 7/5/2017.
 */
var app = angular.module('angulobby');
app.factory('AuthService',
  ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
      var userAuthenticated = null;
      // current session user information
      var currentUser = null;
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register,
        getCurrentUser: function () {
          return currentUser;
        }
      });

      /**
       * returns the current user's authentication status in boolean format
       * @returns {Boolean}
       */
      function isLoggedIn() {
        return userAuthenticated;
      }

      /**
       * sends AJAX request and then handles success or failure
       * @returns: username of the authenticated user
       * @returns: error message if not authenticated
       */
      function getUserStatus() {
        var deferred = $q.defer();
        $http.get('/user/status')
          .then(function (response) {
            // if 200 code and authenticated
            if (response.status === 200 && response.data.isAuthenticated) {
              currentUser = response.data.username;
              deferred.resolve(response.data);
            } else {
              deferred.resolve(response.data.isAuthenticated);
            }
          })
          // handle error thrown
          .catch(function (response) {
            userAuthenticated = false;
            deferred.reject(response.data);
          });
        return deferred.promise;
      }

      /**
       * handles AJAX request to server for login authentication through passport.
       * @param username
       * @param password
       * @returns: {Promise} if error in authentication returns error message to client
       */
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

      /**
       * handles AJAX request to server and flags the authentication status of the client to false. Also removes
       * currentUser information.
       */
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

      /**
       * handles the AJAX request to the server for registration. If a status code 200 is returned with a success
       * message, the service resolves the promise. Otherwise, it returns an error message.
       * @param username
       * @param password
       */
      function register(username, password) {
        // create new instance of deferred
        var deferred = $q.defer();

        // send POST request to the server
        $http.post('/user/register',
          {username: username, password: password})
        // handle success case
          .then(function (response) {
            console.log(response.data.msg);
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
