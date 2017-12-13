(function() {
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
        vm.object = {};
        vm.apiKey = '';
        vm.url = '';
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.apiKey = '&apikey=3370463f';
            vm.url = 'http://www.omdbapi.com/?';
            vm.object = {Title:'',Genre:'',Year:'',Page:''}
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getMovie:getMovie,
            getMovies:getMovies,
            getMovieID:getMovieID,
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
        function getMovie(object) {
            let title = 't='  + object.title;
            let year = '&y=' + object.year;
            let plot = '&plot=full';
            return $http
                    .get(vm.url + title + vm.apiKey + year + plot)
                    .then(loaded => {
                        loaded.data.ratings = {};
                        if(loaded.data.Ratings[0].Value) loaded.data.ratings.imdb = calRatings(loaded.data.Ratings[0].Value);
                        if(loaded.data.Ratings[1].Value) loaded.data.ratings.rottem = calRatings(loaded.data.Ratings[1].Value);
                        if(loaded.data.Ratings[2].Value) loaded.data.ratings.metacritic = calRatings(loaded.data.Ratings[2].Value);
                        return loaded.data;
                    }).catch(e => {return e});
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
        function getMovies(object) {
            let title = 's=' + object.title;
            let plot = '&plot=full';
            let type = '&type=' + object.type;
            let page = '&page=' + object.page;
            vm.object = object;
            return $http
                    .get(vm.url + title + vm.apiKey + plot + type + page)
                    .then(loadedFilms)
                    .catch(e => {return e});
        };
        function loadedFilms(response){
            let films = {}
            if(vm.object.Page == 1){
                films.data = [];
                films.total = String(response.data.totalResults);
            }
            if (response.data.Response === "True") {
                let object = response.data.Search;
                let promise = new Promise(function(resolve,reject){
                    for (let i = 0; i < object.length; i++) {
                        getMovie(object[i])
                            .then(loaded =>{
                                if(loaded.data && loaded.data.Poster != "N/A" && loaded.data.Ratings.length > 0){
                                    let isIn = true;
                                    for (let j = 0; j < films.data.length; j++) {
                                        if(loaded.data.imdbID == films.data[j].imdbID) isIn = false;
                                    }
                                    if(isIn) films.data.push(loaded.data);
                                }
                                if(i == object.length) resolve(films);
                            }).catch(e => {return e});
                    }
                });
                return promise;
            } else return {};
        };
        //////////////////////// FUCTION FILM ID ///////////////////
        /**
         * 
         * @param {*} imbdID 'String': identificador de la pelicula imbdID.
         * Esta funcion devuelve una pelicula completa a partir de su imbdID.
         */
        function getMovieID(imbdID) {
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
        //////////////////////// OTHER FUCTION /////////////////////
        function calRatings(obj){
            let index = obj.indexOf('/');
            if(index != -1){
                let div = parseInt(obj.substring(index + 1, obj.length));
                let param = parseFloat(obj.substring(0,index));
                if(div == 100) param += '%';
                return param;
            }
            else return obj;
            
        };
    }
})();