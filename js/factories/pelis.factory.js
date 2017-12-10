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
        vm.films = {};
        vm.object = {};
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.films = {Total:0,Data:[]};
            vm.object = {Title:'',Genre:'',Year:'',Page:'',nextPage:false}
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getFilm:getFilm,
            getFilms:getFilms,
            getFilmID:getFilmID,
            getGenres:getGenres
        };
        return service;
        //////////////////////// FUCTION FILM //////////////////////
        /**
         * 
         * @param {*} object 'object': {title:'String',year:'String'}
         * title: titulo de la pelicula.
         * year: año de la pelicular.
         * Esta funcion devuelve una pelicula completa.
         */
        function getFilm(object) {
            let url = 'http://www.omdbapi.com/?'
            let title = 't='  + object.Title;
            let apiKey = '&apikey=3370463f';
            let year = '&y=' + object.Year;
            let plot = '&plot=full';
            return $http
                    .get(url + title + apiKey + year + plot)
                    .then(loaded => {return loaded})
                    .catch(e => {return e});
        };
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'object':
         */
        function getFilms(object,nextPage) {
            (nextPage) ? vm.object.Page++ : vm.object.Page = 1;
            vm.object.nextPage = nextPage;
            vm.object.Title = object.Title;
            vm.object.Year = object.Year;
            vm.object.Genre = object.Genre;
            let url = 'http://www.omdbapi.com/?';
            let title = 's=' + vm.object.Title;
            let apiKey = '&apikey=3370463f';
            let plot = '&plot=full';
            let type = '&type=movie';
            let page = '&page=' + vm.object.Page;
            return $http
                    .get(url + title + apiKey + plot + type + page)
                    .then(loadedFilms)
                    .catch(e => {return e});
        };
        function loadedFilms(response){
            if(!vm.object.nextPage){
                vm.films.Data = [];
                vm.films.Total = String(response.data.totalResults);
            }
            if (response.data.Response === "True") {
                let object = response.data.Search;
                for (let i = 0; i < object.length; i++) {
                    getFilm(object[i])
                        .then(resolveGetFilms)
                        .catch(e => {return e});
                }
                let promise = new Promise(function(resolve,reject){
                    setTimeout(function(){resolve(vm.films)},2000);
                });
                return promise;
            } else return {Data:[],Total:''};
        };
        function resolveGetFilms(loaded){
            let isIn = true;
            for (let i = 0; i < vm.films.Data.length; i++) {
                if(!loaded.data) isIn = false;
                if(loaded.data.imdbID == vm.films.Data[i].imdbID) isIn = false;
                if(loaded.data.Poster == "N/A") isIn = false;
                if(loaded.data.Rantings < 1) isIn = false;
            }
            if(isIn) vm.films.Data.push(loaded.data);
            console.log(vm.films.Data);
        };
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
                    .then(loadedID => {return loadedID})
                    .catch(e => {return e});
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