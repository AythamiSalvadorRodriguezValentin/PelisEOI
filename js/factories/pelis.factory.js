(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('PelisServerProvider', PelisServerProvider);

    PelisServerProvider.$inject = ['$http'];
    function PelisServerProvider($http) {
        var service = {
            getPeli:getPeli,
            getPelis:getPelis,
            getGeneros:getGeneros
        };
        return service;
        ////////////////////// Fuction Factory HTTP /////////////////////////
        function getPeli(title, year) {
            let url = 'http://www.omdbapi.com/?t=' + title;
            if(year.bool) url += '&y=' + year.name;
            url += '&plot=full';
            url += '&apikey=3370463f';
            return $http.get(url).then(succesFuction).catch(errorFuction);
        };
        function getPelis(title) {
            let url = 'http://www.omdbapi.com/?s=' + title;
            url += '&plot=full';
            url += '&apikey=3370463f';
            return $http.get(url).then(succesFuction).catch(errorFuction);
        };
        function succesFuction(response){
            return response.data;
        };
        function errorFuction(response){
            return response
        };
        ////////////////////////////// GENEROS //////////////////////////////
        function getGeneros(){
            return ['Action','Adventure','Animation','Comedy','Crime','Documentary',
            'Drama','Family','Fantasy','History','Horror', 'Music',
            'Mystery','Romance','Fiction','TVMovies','Thriller','War',
            'Western'];
        };
    }
})();