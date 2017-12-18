(function () {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .factory('OmdbIDServerProvider', OmdbIDServerProvider);
    ////////////////////////////////////////////////////////////
    OmdbIDServerProvider.$inject = ['$http'];
    function OmdbIDServerProvider($http) {
        let vm = this;
        /////////////////////// VAR FILM ///////////////////////////
        vm.apiKey = '';
        vm.url = '';
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.apiKey = '&apikey=3370463f';
            vm.url = 'http://www.omdbapi.com/?';
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getMovie: getMovie,
            getMovieID: getMovieID,
        };
        return service;
        //////////////////////// FUCTION FILM //////////////////////
        /**
         * 
         * @param {*} object 'object': {Title:'String',Year:'String'}
         * Title: Titulo de la pelicula --> "Madagascar...".
         * Year: Año de la pelicular. --> "2010"
         * Esta funcion devuelve una pelicula completa.
         */
        function getMovie(object) {
            let title = ('t=' + object.title).split(' ').join('+');
            let year = '&y=' + object.year;
            let plot = '&plot=full';
            return $http
                .get(vm.url + title + vm.apiKey + year + plot)
                .then(loaded => {
                    loaded.data.ratings = {};
                    if (loaded.data.Ratings) {
                        if (loaded.data.Ratings[0]) loaded.data.ratings.imdb = calRatings(loaded.data.Ratings[0].Value);
                        if (loaded.data.Ratings[1]) loaded.data.ratings.rottem = calRatings(loaded.data.Ratings[1].Value);
                        if (loaded.data.Ratings[2]) loaded.data.ratings.metacritic = calRatings(loaded.data.Ratings[2].Value);
                    }
                    return loaded.data;
                }).catch(e => { return e });
        };
        //////////////////////// FUCTION FILM ID ///////////////////
        /**
         * 
         * @param {*} imbdID 'String': identificador de la pelicula imbdID.
         * Esta funcion devuelve una pelicula completa a partir de su imbdID.
         */
        function getMovieID(imbdID) {
            let id = 'i=' + imbdID;
            let plot = '&plot=full';
            return $http
                .get(vm.url + id + vm.apiKey + plot)
                .then(loaded => {
                    if (loaded.status != 200 && loaded.statusText != 'OK') return;
                    loaded.data.ratings = {};
                    if (loaded.data.Ratings) {
                        if (loaded.data.Ratings[0]) loaded.data.ratings.imdb = calRatings(loaded.data.Ratings[0].Value);
                        if (loaded.data.Ratings[1]) loaded.data.ratings.rottem = calRatings(loaded.data.Ratings[1].Value);
                        if (loaded.data.Ratings[2]) loaded.data.ratings.metacritic = calRatings(loaded.data.Ratings[2].Value);
                    }
                    return loaded.data;
                })
                .catch(e => { return e });
        };
        //////////////////////// OTHER FUCTION /////////////////////
        function calRatings(obj) {
            let index = obj.indexOf('/');
            if (index != -1) {
                let div = parseInt(obj.substring(index + 1, obj.length));
                let param = parseFloat(obj.substring(0, index));
                if (div == 100) param += '%';
                return param;
            }
            else return obj;
        };
    }
})();