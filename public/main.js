var app = angular.module('angulobby', ['ngRoute']);
/**
 * route handling
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      access: { restricted: true }
    })
    .when('/login', {
      templateUrl: 'pages/login.html',
      controller: 'loginController',
      access: { restricted: false }
    })
    .when('/logout', {
      controller:  'logoutController',
      access: { restricted: true }
    })
    .when('/register', {
      templateUrl: 'pages/register.html',
      controller: 'registerController',
      access: { restricted: false }
    })
    .when('/contact', {
      templateUrl: 'pages/contact.html',
      access: {restricted: true }
    })
    .when('/lobby/:lobbyId', {
      templateUrl: 'pages/lobby.html',
      controller: 'lobbyController',
      access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

}]);

/**
 * Every time we change route, we check to make sure that the user is authenticated. If the user is not, we route them
 * to the login screen.
 */
app.run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
  function (event, next, current) {
    AuthService.getUserStatus()
      .then(function(response){
        if (next.access.restricted && !response.isAuthenticated){
          $location.path('/login');
          $route.reload();
        }
      })
        .catch(function(response) {

        });
  });
});

