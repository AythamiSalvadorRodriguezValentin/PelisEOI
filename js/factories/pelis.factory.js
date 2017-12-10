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
        vm.apiKey = '';
        vm.url = '';
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.films = {Total:0,Data:[]};
            vm.apiKey = '&apikey=3370463f';
            vm.url = 'http://www.omdbapi.com/?';
            vm.object = {Title:'',Genre:'',Year:'',Page:''}
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
         * @param {*} object 'object': {Title:'String',Year:'String'}
         * Title: Titulo de la pelicula --> "Madagascar...".
         * Year: Año de la pelicular. --> "2010"
         * Esta funcion devuelve una pelicula completa.
         */
        function getFilm(object) {
            let title = 't='  + object.Title;
            let year = '&y=' + object.Year;
            let plot = '&plot=full';
            return $http
                    .get(vm.url + title + vm.apiKey + year + plot)
                    .then(loaded => {return loaded})
                    .catch(e => {return e});
        };
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'Object':{Title: titulo o inicio del titulo de la pelicula a buscar --> "Madagascar...",
         * Year: Intervalo de años entre los que deseas buscar --> "2000-2010",
         * Genre: géneros que deseas filtrar en la búsqueda --> "Action, Crime, Fiction, War, ...",
         * Page: página en la que deseas buscar --> "1", "2" ... "1000",
         * Type: tipo de búsqueda --> "movie", "series" o "episode",
         * Plot: tipo de respuesta --> "short" o "full"}
         * @param {*} nextPage 
         */
        function getFilms(object) {
            let title = 's=' + object.Title;
            let plot = '&plot=' + object.Plot;
            let type = '&type=' + object.Type;
            let page = '&page=' + object.Page;
            vm.object = object;
            return $http
                    .get(vm.url + title + vm.apiKey + plot + type + page)
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
                    setTimeout(function(){
                        if (typeof vm.films.Data != 'undefined' 
                            && typeof vm.films.Total != 'undefined') resolve(vm.films);
                        else reject("No hay peliculas disponibles");
                    }, 1000);
                });
                return promise;
            } else return {};
        };
        function resolveGetFilms(loaded){
            if(loaded.data && loaded.data.Poster != "N/A" && loaded.data.Ratings.length > 0){
                let isIn = true;
                for (let j = 0; j < vm.films.Data.length; j++) {
                    if(loaded.data.imdbID == vm.films.Data[j].imdbID) isIn = false;
                }
                if(isIn) vm.films.Data.push(loaded.data);
            }
        };
        //////////////////////// FUCTION FILM ID ///////////////////
        /**
         * 
         * @param {*} imbdID 'String': identificador de la pelicula imbdID.
         * Esta funcion devuelve una pelicula completa a partir de su imbdID.
         */
        function getFilmID(imbdID) {
            let id = 'i='  + imbdID;
            let plot = '&plot=full';
            return $http
                    .get(vm.url + id + vm.apiKey + plot)
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