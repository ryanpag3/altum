/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('queueTimerController', [
  '$scope', '$interval', 'QueueService', 'AuthService', function ($scope, $interval, QueueService, AuthService) {

    /**
     * calls the queue service to remove user from all queues, and logs a result message
     */
    $scope.cancel = function () {
      QueueService.removeFromAllQueues(AuthService.getCurrentUser()) // remove user from all active queues
        .then(function (res) {
          console.log(res.status + ': ' + res.data.msg);
          // todo: present information on ui
        })
        .catch(function (res) {
          console.log(res.status + ': ' + res.data.msg);
          // todo: present information on ui
        });
    };


    $scope.counter = 0; // timer counter
    $scope.timer = '0:00'; // set initial timer value
    var timerPromise; // holds the $interval promise required to cancel the $interval
    /**
     * watches to see if the displayQueueTimer flag is set to true, and starts the timer if so
     */
    $scope.$watch('displayQueueTimer', function (newValue) {
      if (newValue) {
        // set starting positions
        $scope.counter = 0;
        $scope.timer = '0:00';
        startTimer();
      } else {
        // stop timer
        // $interval.cancel(timer);
        stopTimer();
      }
    });
    // starts the timer
    var startTimer = function () {
      timerPromise = $interval(function () {
        $scope.counter++;
        $scope.timer = secondsToMinutesAndSeconds($scope.counter);
      }, 1000);
    };
    // stops the timer
    var stopTimer = function () {
      $interval.cancel(timerPromise);
    }
  }
]);

// helper functions
function secondsToMinutesAndSeconds(seconds) {
  var minutes = Math.floor(seconds / 60);
  var seconds = ((seconds % 60));
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
