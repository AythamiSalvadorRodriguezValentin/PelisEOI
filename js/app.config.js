angular.module('PelisEOI',['ngRoute']).config(config);
config.$inject = ['$routeProvider'];
function config($routeProvider){
    $routeProvider
        .when('/',{
            controller:'PelisEOIController',
            templateUrl:'/views/PelisEOI.html',
            controllerAs:'$PelisEOI'
        })
        .when('/films/:id',{
            controller:'FilmController',
            templateUrl:'/views/film.html',
            controllerAs:'$films',
            resolve:{
                Film:FilmResolveFactory
            }
        })
        .otherwise({redirectTo:'/'});
};
FilmResolveFactory.$inject = ['$route','PelisServerProvider'];
function FilmResolveFactory($route,PelisServerProvider){
    return PelisServerProvider.getFilmID($route.current.params.id);
}