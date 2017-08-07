/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('paramsController',
  ['$scope', '$location', 'GameListService', 'QueueService', 'AuthService',
    function ($scope, $location, GameListService, QueueService, AuthService) {
      $scope.games = []; // game names
      $scope.ranks = []; // game ranks
      $scope.pic = 'http://i.imgur.com/h2JGeNS.jpg'; // default photo
      $scope.rankListShown = false; // ng-show for rank dropdown
      var RANK_RANGE = 1; // the distance above and below the rank to queue for
      var game, rankRange = []; // selected game and selected game's rank range

      /**
       * Assigns a game to the game variable when a user chooses from the dropdown, fills out the rank array
       * for the rank ui dropdown element and a picture to display as well. Flags the rankListShown ng-show boolean
       * to update ui.
       */
      $scope.updateGame = function () {
        game = $scope.selectedGame;
        $scope.ranks = game.ranks;
        $scope.pic = game.pic;
        $scope.rankListShown = true;
      };

      /**
       * creates a rankRange for the user's selected queue parameters. This is how a user will be entered into
       * a variety of queues based on their selected rank.
       */
      $scope.updateRank = function () {
        rankRange = [];
        var index = $scope.selectedRankIndex - RANK_RANGE; // move pointer down two
        // if selected rank is near bottom, move range start to 0
        if (index < 0) {
          index = 0;
        }
        // create max range
        var max = index + (RANK_RANGE * 2);
        // iterate through and push ranks to rankRange
        while (index <= max && index < $scope.ranks.length) {
          rankRange.push($scope.ranks[index++].replace(/\s+/g, '').toLocaleLowerCase());
        }
      };

      /**
       * If the user has selected a game and a rank, and the controller has generated a rank range for the user,
       * iterate through and create urls for each queue to be entered into. Queue urls are
       * 'lobby size'_'game short name'_'rank'. Calls the queue service add function to enter user.
       */
      $scope.joinQueue = function () {
        // check to see if both game and rank were selected
        if (game !== undefined && rankRange !== undefined) {
          for (var i = 0; i < rankRange.length; i++) {
            // create queue identifier based on selection
            var queue = game.lobby_size + '_' + game.short_name + '_' + rankRange[i];
            QueueService.addToQueue(AuthService.getCurrentUser(), queue);
          }
        } else {
          alert('queue information has not been set, please try again!');
        }
      };

      /**
       * on controller instantiation, calls the game list service get function to retrieve
       * the master game list from the database, and applies that information to the scope.
       */
      GameListService.getGames()
        .then(function (res) {
          $scope.games = res;
        })
        .catch(function (err) {
          $scope.errorMessage = err;
        });
    }]);
