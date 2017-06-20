/**
 * Created by dev on 6/20/2017.
 */
// service named AuthService
// injected the dependencies that will be used
// $q, $timeout, $http
angular.module('angulobby').factory('AuthService',
  [$q, $timeout, $http,
    function ($q, $timeout, $http){
      var user = null;
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
      });
    }]);
