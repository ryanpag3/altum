/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('queueTimerController', [
  '$scope', 'QueueService', 'AuthService', function($scope, QueueService, AuthService) {
    $scope.cancel = function() {
      QueueService.removeFromAllQueues(AuthService.getCurrentUser()) // remove user from all active queues
        .then(function(res) {
          console.log(res.status + ': ' + res.data.msg);
        })
        .catch(function(res) {
          console.log(res.status + ': ' + res.data.msg);
        });
    }
  }
]);
