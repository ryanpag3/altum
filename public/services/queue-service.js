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

    /**
     * handles ajax call to enter a user into a queue
     * @param username: username of user to be entered
     * @param queue: queue url
     * @returns {Promise} failure: error message from ajax call
     */
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

    /**
     * removes a specified user from a specified queue
     * @param username
     * @param queue
     * @returns {Promise} success: success message string
     *                    failure: failure message string
     */
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

    /**
     * handles ajax call to remove specified user from all relevant queues
     * @param username
     * @returns {Promise} success: success message
     *                    error: error message
     */
    function removeFromAllQueues(username) {
      var deferred = $q.defer();
      $http.post('/queue/remove-all', {username: username})
        .then(function (res) {
          if (res.status === 200) {
            deferred.resolve(res);
          } else {
            deferred.reject();
          }
        })
        .catch(function (res) {
          deferred.reject(res);
        });
      return deferred.promise;
    }
  }]);
