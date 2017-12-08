angular.module('PelisEOI',['ngRoute']).config(config);
config.$inject = ['$routeProvider'];
function config($routeProvider){
    $routeProvider
        .when('/',{
            controller:'PelisEOIController',
            templateUrl:'/views/PelisEOI.html',
            controllerAs:'$PelisEOI'
        })
        .otherwise({redirectTo:'/'});
};