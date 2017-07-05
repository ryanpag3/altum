/**
 * Created by dev on 7/5/2017.
 */
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
