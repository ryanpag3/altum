/**
 * Created by dev on 7/5/2017.
 */
var app = angular.module('angulobby');
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
