/**
 * Created by dev on 6/21/2017.
 */
/**
 * Controllers are used to add behavior to the $scope object.
 * error: data-ng-show="error" sets <div> contents to {{errorMessage}}
 * disabled: boolean which controls visibility of login button
 *
 * loginController handles the transaction between the AuthService and the front-end
 * AuthService: service that handles the Ajax calls
 * location: current page
 * scope: current DOM scope, set by the data-ng-controller directive
 */
angular.module('angulobby').controller('loginController',
  ['$scope', '$location', 'AuthService', 'socket',
  function ($scope, $location, AuthService, socket) {
    $scope.login = function() {
      // initial values
      $scope.error = false; // error thrown
      $scope.disabled = true; // button disabled

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          socket.emit('add-user', $scope.loginForm.username);
          $scope.loginForm = {};
        })
        // handle error
        .catch(function (err) {
          $scope.error = true;
          $scope.errorMessage = err;
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    }
  }]);

/**
 * loginController calls the AuthService.logout function
 * and sets the page to the login on success.
 */
angular.module('angulobby').controller('logoutController',
['$scope', '$location', 'AuthService', 'socket',
  function ($scope, $location, AuthService, socket) {
    $scope.logout = function() {
      var username = AuthService.getCurrentUser();
      AuthService.logout()
        .then(function() {
          $location.path('/login');
          socket.emit('delete-user', username);
        });
    };
  }]);

/**
 *
 */
angular.module('angulobby').controller('registerController',
['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function(){
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
      // handle error
        .catch(function(err){
          $scope.error = true;
          $scope.errorMessage = err;
          $scope.disabled = false;
          $scope.registerForm = {};
        })
    };
  }]);

/**
 *
 */
angular.module('angulobby').controller('homeController',
  ['$scope', 'socket', 'AuthService', 'QueueService',
  function($scope, socket, AuthService) {
    $scope.messages = [];
    $scope.text = null;
    $scope.paramWindowState = false;
    socket.emit('join-room', 'home'); // join global chat

    $scope.setQueueParams = function() {
      $scope.paramWindowState = true;
    };

    $scope.leaveQueues = function() {
      QueueService.removeFromAllQueues(AuthService.getCurrentUser())
        .then(
          // handle success
        )
        .catch(function(err) {
        // handle failure
        });
    };

    $scope.sendMessage = function () {
      var data = {room: 'home', username: AuthService.getCurrentUser(), message: $scope.text };
      socket.emit('send-message', data);
      $scope.text = null;
    };

    socket.on('update-chat', function(message) {
        $scope.messages.push(message);
        $scope.$apply();
    });
  }]);


angular.module('angulobby').controller('paramsController',
['$scope', 'GameListService', 'QueueService', 'AuthService',
  function($scope, GameListService, QueueService, AuthService){
  $scope.games = [];
  $scope.ranks = [];
  $scope.rankListShown = false;
  var RANK_RANGE = 2; // the distance above and below the rank to queue for
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
