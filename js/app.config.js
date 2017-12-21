angular.module('PelisEOI', ['ngRoute']).config(config);
config.$inject = ['$routeProvider'];
function config($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'PelisEOIController',
            templateUrl: '/views/PelisEOI.html',
            controllerAs: '$films'
        })
        .when('/user', {
            controller: 'PerfilUserController',
            templateUrl: '/views/PerfilUser.html',
            controllerAs: '$user'
        })
        .when('/user/register', {
            controller: 'RegisterUserController',
            templateUrl: '/views/RegisterUser.html',
            controllerAs: '$register'
        })
        .when('/user/login', {
            controller: 'LoginUserController',
            templateUrl: '/views/LoginUser.html',
            controllerAs: '$login'
        })
        .otherwise({ redirectTo: '/' });
};