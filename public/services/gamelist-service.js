/**
 * Created by dev on 7/5/2017.
 */
app.factory('GameListService',
  ['$http', '$q',
    function ($http, $q) {
      return ({
        getGames: getGames
      });

      /**
       * Sends AJAX request to get the update master game list information from the database.
       * @returns: {Promise}
       *           success: master game list with rank information for each game
       *           error: error message
       */
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
    }]);
