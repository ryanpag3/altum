/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('queueTimerController', [
  '$scope', '$interval', 'QueueService', 'AuthService', function ($scope, $interval, QueueService, AuthService) {

    $scope.cancel = function () {
      QueueService.removeFromAllQueues(AuthService.getCurrentUser()) // remove user from all active queues
        .then(function (res) {
          console.log(res.status + ': ' + res.data.msg);
        })
        .catch(function (res) {
          console.log(res.status + ': ' + res.data.msg);
        });
    };


    $scope.counter = 0; // timer counter
    $scope.timer = '0:00';
    var timerPromise; // holds the $interval promise required to cancel the $interval
    $scope.$watch('displayQueueTimer', function (newValue) {
      // if displayQueueTimer
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
