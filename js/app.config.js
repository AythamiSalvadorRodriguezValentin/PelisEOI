angular.module('PelisEOI', ['ngRoute']).config(config);
config.$inject = ['$routeProvider'];
function config($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'PelisEOIController',
            templateUrl: '/PelisEOI/views/PelisEOI.html',
            controllerAs: '$films'
        })
        .when('/user', {
            controller: 'PerfilUserController',
            templateUrl: '/PelisEOI/views/PerfilUser.html',
            controllerAs: '$user'
        })
        .otherwise({ redirectTo: '/' });
};