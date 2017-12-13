angular.module('PelisEOI',['ngRoute','uiSlider']).config(config);
config.$inject = ['$routeProvider'];
function config($routeProvider){
    $routeProvider
        .when('/',{
            controller:'PelisEOIController',
            templateUrl:'/views/PelisEOI.html',
            controllerAs:'$films'
        })
        .otherwise({redirectTo:'/'});
};