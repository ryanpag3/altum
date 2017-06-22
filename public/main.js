var app = angular.module('angulobby', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'IndexController',
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
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

}]);



app.controller('IndexController', function ($scope, socket) {
  $scope.alert = function () {
    console.log('emitting test alert call');
    socket.emit('test');
  };

  socket.on('test', function () {
    console.log('test called');
    alert('test message');
  });

});

app.run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
  function (event, next, current) {
    AuthService.getUserStatus()
      .then(function(){
        console.log('then function called');
        console.log("restricted? " + next.access.restricted);
        console.log("logged in? " + AuthService.isLoggedIn());
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});
