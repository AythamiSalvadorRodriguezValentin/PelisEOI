(function() {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .factory('PelisServerProvider', PelisServerProvider);
    ////////////////////////////////////////////////////////////
    PelisServerProvider.$inject = ['$http'];
    function PelisServerProvider($http) {
        let vm = this;
        /////////////////////// VAR FILM ///////////////////////////
        vm.films = [];
        vm.object = {};
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.object = {
                Ok:'True',
                Title:'',
                Type:'movie',
                Plot:'full',
                Index:0,
                Page:1,
                Data:[],
            };
            vm.films = {
                Total:0,
                Data:[]
            }
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getFilmID:getFilmID,
            getFilms:getFilms,
            getGenres:getGenres
        };
        return service;
        //////////////////////// FUCTION FILM ID ///////////////////
        /**
         * 
         * @param {*} object 'object': {title:'String',year:'String'}
         * title: titulo de la pelicula.
         * year: año de la pelicular.
         * Esta funcion devuelve una pelicula completa.
         */
        function getFilmID(IMDb) {
            let url = 'http://www.omdbapi.com/?'
            let id = 'i='  + IMDb;
            let apiKey = '&apikey=3370463f';
            let plot = '&plot=full';
            return $http
                    .get(url + id + apiKey + plot)
                    .then(loadedID)
                    .catch(loadedIDError);
        };
        function loadedID(response){
            return response;
        };
        function loadedIDError(response){
            return response;
        }
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'object':
         */
        function getFilms(object) {
            vm.object = object;
            let url = 'http://www.omdbapi.com/?';
            let title = 's=' + object.Title;
            let apiKey = '&apikey=3370463f';
            let plot = '&plot=' + object.Plot;
            let type = '&type=' + object.Type;
            let page = '&page=' + object.Page;
            return $http
                    .get(url + title + apiKey + plot + type + page)
                    .then(loadedFilms)
                    .catch(loadedFilmsError);
        };
        function loadedFilms(response){
            vm.object.Index = 0;
            vm.object.Data = response.data.Search;
            vm.object.Ok = response.data.Response;
            vm.object.Status = response.status;
            vm.films.Total = response.data.totalResults;
            vm.films.Data = [];
            return (vm.object.Ok === 'True') ? getFilm() : {};
        };
        function loadedFilmsError(response){
            return response;
        }
        //////////////////////// FUCTION FILM //////////////////////
        /**
         * 
         * @param {*} object 'object': {title:'String',year:'String'}
         * title: titulo de la pelicula.
         * year: año de la pelicular.
         * Esta funcion devuelve una pelicula completa.
         */
        function getFilm() {
            let url = 'http://www.omdbapi.com/?'
            let title = 't='  + vm.object.Data[vm.object.Index].Title;
            let apiKey = '&apikey=3370463f';
            let year = '&y=' + vm.object.Data[vm.object.Index].Year;
            let plot = '&plot=' + vm.object.Plot;
            return $http
                    .get(url + title + apiKey + year + plot)
                    .then(loadedTitle)
                    .catch(loadedTitleError);
        };
        function loadedTitle(response){
            vm.object.Index++;
            if(response.status === 200){
                if(response.data.Poster !== 'N/A' && response.data.Ratings.length >= 3)
                vm.films.Data.push(response.data);
            }
            if(vm.object.Index == vm.object.Data.length){
                return vm.films;
            }
            return getFilm();
        };
        function loadedTitleError(response){
            return response;
        }
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
        //////////////////////// FUCTION GENRE /////////////////////
        function getGenres(){
            return ['Action','Adventure','Animation','Comedy','Crime','Documentary',
                    'Drama','Family','Fantasy','History','Horror', 'Music',
                    'Mystery','Romance','Fiction','TVMovies','Thriller','War',
                    'Western'];
        };
    }
})();