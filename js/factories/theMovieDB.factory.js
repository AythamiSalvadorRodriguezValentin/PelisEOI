(function() {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .factory('TheMovieDBServerProvider', TheMovieDBServerProvider);
    ////////////////////////////////////////////////////////////
    TheMovieDBServerProvider.$inject = ['$http'];
    function TheMovieDBServerProvider($http) {
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
            vm.films = {total:'',pages:'',data:[]};
            vm.url = 'https://api.themoviedb.org/3/';
            vm.apiKey = 'api_key=bf25fd935c58ff22732b9dd60088ff5e';
            vm.object = {title:'',genre:'',year:'',page:''}
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getMovieDBID:getMovieDBID,
            getMoviesDBSearch:getMoviesDBSearch,
            getMoviesDBPopular:getMoviesDBPopular
        };
        return service;
        //////////////////////// FUCTION FILM //////////////////////
        /**
         * 
         * @param {*} object 'object': {...}
         */
        function getMovieDBID(object) {
            let type = 'find/';
            let id =  object.id + '?';
            let language = 'language=' + object.language;
            let external_source = '&external_source=' + object.ExternalID;
            return $http
                    .get(vm.url + type + id + language + vm.apiKey + external_source)
                    .then(loaded => {return loaded})
                    .catch(e => {return e});
        };
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'Object': {...}
         */
        function getMoviesDBSearch(object) {
            /* let type = 'movie/popular?'; */
            let type = 'search/movie?';
            let query = '&query='  + object.title;
            let language = '&language=' + object.language;
            let include_adult = '&include_adult=false';
            let page = '&page=' + object.page;
            vm.object = object;
            return $http
                    .get(vm.url + type + vm.apiKey + query + language + include_adult + page)
                    .then(moviesDBSearch)
                    .catch(e => {return e});
        };
        function moviesDBSearch(response){
            if (response.status == 200 && response.statusText == "OK") {
                vm.films.total = String(response.data.total_results);
                vm.films.pages = String(response.data.total_pages);
                vm.films.data = response.data.results;
                for (let i = 0; i < vm.films.data.length; i++)
                    vm.films.data[i].poster = 'https://image.tmdb.org/t/p/w640' + vm.films.data[i].poster_path;            
                return vm.films;
            } else return {};
        };
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'Object': {...}
         */
        function getMoviesDBPopular(object) {
            let type = 'movie/popular?';
            let language = '&language=' + object.language;
            let include_adult = '&include_adult=false';
            let page = '&page=' + object.page;
            vm.object = object;
            return $http
                    .get(vm.url + type + vm.apiKey + language + include_adult + page)
                    .then(moviesDBPopular)
                    .catch(e => {return e});
        };
        function moviesDBPopular(response){
            if (response.status == 200 && response.statusText == "OK") {
                vm.films.total = String(response.data.total_results);
                vm.films.pages = String(response.data.total_pages);
                vm.films.data = response.data.results;
                for (let i = 0; i < vm.films.data.length; i++)
                    vm.films.data[i].poster = 'https://image.tmdb.org/t/p/w640' + vm.films.data[i].poster_path;            
                return vm.films;
            } else return {};
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