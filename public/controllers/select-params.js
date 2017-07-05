/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('paramsController',
['$scope', 'GameListService', 'QueueService', 'AuthService',
  function($scope, GameListService, QueueService, AuthService){
  $scope.games = [];
  $scope.ranks = [];
  $scope.rankListShown = false;
  var RANK_RANGE = 1; // the distance above and below the rank to queue for
  var game, rankRange = [];

  // on update, assign selected game and show rank select box
  $scope.updateGame = function() {
      game = $scope.selectedGame;
      $scope.ranks = game.ranks;
      $scope.rankListShown = true;
  };

  $scope.updateRank = function() {
    rankRange = [];
    var index = $scope.selectedRankIndex - RANK_RANGE; // move pointer down two
    if (index < 0) {
      index = 0;
    }

    var max = index + (RANK_RANGE * 2);
    while (index <= max
            && index < $scope.ranks.length) {
           rankRange.push($scope.ranks[index++].replace(/\s+/g, '').toLocaleLowerCase());
    }
    console.log('rank range: ' + rankRange.join(', '));
  };

  $scope.joinQueue = function() {
    if (game !== undefined && rankRange !== undefined) {
      for (var i = 0; i < rankRange.length; i++) {
        var queue = game.shortName + '_' + rankRange[i];
        console.log('you have been entered into: ' + queue);
        QueueService.addToQueue(AuthService.getCurrentUser(), queue);
      }
    } else {
      // throw error
    }
  };

  // gets most recent master list from db
  GameListService.getGames()
    .then(function(res) {
      $scope.games = res;
      console.log(games);
    })
    .catch(function(err) {
      $scope.errorMessage = err;
    });
}]);
