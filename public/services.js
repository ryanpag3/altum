/**
 * Created by dev on 6/20/2017.
 */
// service named AuthService
// injected the dependencies that will be used
// $q, $timeout, $http
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
            // // status returns true if user is authenticated
            // if (response.data.isAuthenticated) {
            //   console.log('user authenticated === true');
            //   userAuthenticated = true;
            //   currentUser = response.data.username;
            // } else {
            //   console.log('user authenticated === false');
            //   userAuthenticated = false;
            // }
          })
          .catch(function (response) {
            console.log('user authenticated === false');
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
  };
}]);

app.factory('QueueService', [
  '$http', '$q',
  function ($http, $q) {
    return ({
      addToQueue: addToQueue,
      removeFromQueue: removeFromQueue,
      removeFromAllQueues: removeFromAllQueues
    });

    function addToQueue(username, queue) {
      var deferred = $q.defer();
      $http.post('/queue/add', {username: username, queue: queue})
        .then(function (res) {
          if (res.status === 200) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .catch(function (res) {
          deferred.reject(res.data.msg);
        });
      return deferred.promise;
    }

    function removeFromQueue(username, queue) {
      var deferred = $q.defer();
      $http.post('/queue/remove', {username: username, queue: queue})
        .then(function (res) {
          if (res.status === 200) {
            deferred.resolve(res.data.msg);
          } else {
            deferred.reject();
          }
        })
        .catch(function (res) {
          deferred.reject(res.data.msg);
        });
      return deferred.promise;
    }

    function removeFromAllQueues(username) {
      var deferred = $q.defer();
      $http.post('/queue/remove-all', {username: username})
        .then(function (res) {
          if (res.status === 200) {
            deferred.resolve(res.data.msg);
          } else {
            deferred.reject();
          }
        })
        .catch(function (res) {
          deferred.reject(res.data.msg);
        });
      return deferred.promise;
    }
  }]);

app.factory('GameListService',
  ['$http', '$q',
    function ($http, $q) {
      return ({
        getGameNames: getGameNames,
        getGameRanks: getGameRanks,
        getGames: getGames
      });

      // returns array of  {game, lobby_size}
      function getGames() {
        var deferred = $q.defer();
        $http.get('/games/get')
          .then(function(res) {
            // array of json objects with name and lobby_size
            var games = res.data.docs;
            // on success
            deferred.resolve(games);
          })
          .catch(function(err) {
            deferred.reject(err.data.msg);
          });
        return deferred.promise;
      }

      // returns array of names
      function getGameNames() {
        var deferred = $q.defer();
        $http.get('/games/get-names')
          .then(function (res) {
            // on success
            var t = res.data.docs, games = [];
            for (var i = 0; i < t.length; i++){
              games.push(t[i].name); // add name strings to array to send to controller
            }
            deferred.resolve(games);
          })
          .catch(function (err) {
            // error thrown
            deferred.reject(err.data.msg);
          });
        return deferred.promise;
      }

      // return array of array of ranks
      function getGameRanks() {
        var deferred = $q.defer();
        $http.get('/games/get-ranks')
          .then(function(res) {
            var ranks = [], t = res.data.docs;
            for (var i = 0; i < t.length; i++){
              ranks.push(t[i]);
            }
            deferred.resolve(ranks);
          })
          .catch(function(err) {
            // error thrown
            deferred.reject(err.data.msg);
          });
        return deferred.promise;
      }
    }]);
