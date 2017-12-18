(function () {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .factory('TheMovieDBServerProvider', TheMovieDBServerProvider);
    ////////////////////////////////////////////////////////////
    TheMovieDBServerProvider.$inject = ['$http', '$sce'];
    function TheMovieDBServerProvider($http, $sce) {
        let vm = this;
        /////////////////////// VAR FILM ///////////////////////////
        vm.movieDB = {};
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.movieDB.url = 'https://api.themoviedb.org/3/';
            vm.movieDB.apiKey = 'api_key=bf25fd935c58ff22732b9dd60088ff5e';
            vm.movieDB.typeDB = {
                id: {
                    type: 'movie/',
                    end: '?'
                },
                discover: 'discover/movie?',
                search: 'search/movie?',
                topRated: 'movie/upcoming?',
                upcoming: 'movie/top_rated?',
                popular: 'movie/popular?',
                similar: {
                    type: 'movie/',
                    end: '/similar?'
                },
                video: {
                    type: 'movie/',
                    end: '/videos?'
                },
                genres: 'genre/movie/list?'
            }
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getMovieFull: getMovieFull,
            getMoviesDB: getMoviesDB,
            getOrderBy: getOrderBy
        };
        return service;
        /////////////////////// FUCTION FILM ///////////////////////
        function getMovieFull(object) {
            let p1 = new Promise(function (resolve, reject) {
                getMoviesDB(object, 'id')
                    .then(loaded => {
                        resolve(loaded);
                    }).catch(e => reject(e));
            });
            let p2 = new Promise(function (resolve, reject) {
                getMoviesDB(object, 'similar')
                    .then(loaded => {
                        resolve(loaded);
                    }).catch(e => reject(e));
            });
            let p3 = new Promise(function (resolve, reject) {
                getMoviesDB(object, 'video')
                    .then(loaded => {
                        resolve(loaded);
                    }).catch(e => reject(e));
            });
            return Promise
                .all([p1, p2, p3])
                .then(loaded => {
                    let data = {};
                    data = loaded[0];
                    data.similar = loaded[1];
                    data.video = loaded[2];
                    return data;
                }).catch(e => { return e; });
        };
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'Object': {id, externalID, title, genre, language, page, sort_by, release_date_gte, release_date_lte}
         * @param {*} type 'String': type
         * type = 'id','discover','search','popular','similar','video';
         *      'id'        --> Búsqueda por ID -> necesita-> id, language, externalID.
         *      'discover'  --> Búsqueda por discover -> necesita-> language, sort_by,
         *                          filtros-> 'release_date_gte','release_date_lte'
         *      'search'    --> Búsqueda por search -> title('interestelar...'), language, page.
         *      'topRated' --> Búsqueda por top rated -> necesita-> language, page.
         *      'upcoming'  --> Búsqueda por upcoming -> necesita-> language, page.
         *      'popular'   --> Búsqueda por populares -> necesita-> language, page.
         *      'similar'   --> Búsqueda por similares -> necesita-> id, language, page.
         *      'video'     --> Búsqueda por videos -> necesita-> id, language.
         * Examples
         * ========
         * id = '947464'.
         * externalID = 'imdb_id' o 'freebased_mid' o 'freebase_id' o 'tvdb_id' o 'tvrage_id'.
         * title = 'Interestelar'.
         * genre = [21,45,67,...].
         * language = 'en-US' o 'es-ES' o ...
         * page = '1' o '2' o '3' ...
         * sort_by = 'popularity.asc' o 'popularity.desc' o 'release_date.asc' o 'release_date.desc' o 'revenue.asc' o 
         *           'revenue.desc' o 'primary_release_date.asc' o 'primary_release_date.desc' o 'original_title.asc' o 
         *           'original_title.desc' o 'vote_average.asc' o 'vote_average.desc' o 'vote_count.asc' o 'vote_count.desc'.
         *           -- Se pide desde la fábrica con la función --> getOrderBy() --
         * release_date_gte = 'xxxx-01-01' -> mínimo
         * release_date_lte = 'xxxx-31-12' -> máximo
         * 
         */
        function getMoviesDB(object, type) {
            let url = '';
            if (type == 'topRated' || type == 'upcoming' || type == 'popular') {   /* top rated, upcoming, popular */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&language=' + object.language
                    + '&page=' + object.page;
            } else if (type == 'id') {    /* id */
                url = vm.movieDB.url + vm.movieDB.typeDB[type].type + object.id + vm.movieDB.typeDB[type].end
                    + vm.movieDB.apiKey + '&language=' + object.language + '&external_source=' + object.externalID;
            } else if (type == 'discover') {   /* discover */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&language=' + object.language
                    + '&page=' + object.page + '&sort_by=' + object.sort_by + '&release_date.gte=' + object.release_date_gte
                    + '&release_date_lte=' + object.release_date_lte + '&with_genres=' + object.genre.join('%2C');
            } else if (type == 'search') {   /* search */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&query=' + object.title
                    + '&language=' + object.language + '&page=' + object.page;
            } else if (type == 'similar') {   /* similar */
                url = vm.movieDB.url + vm.movieDB.typeDB[type].type + object.id + vm.movieDB.typeDB[type].end
                    + vm.movieDB.apiKey + '&language=' + object.language + '&page=' + object.page;
            } else if (type == 'video') {   /* video */
                url = vm.movieDB.url + vm.movieDB.typeDB[type].type + object.id + vm.movieDB.typeDB[type].end
                    + vm.movieDB.apiKey + '&language=' + object.language;
            } else if (type == 'genres') {  /* genres */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&language=' + object.language;
            } else return {};
            return $http
                .get(url)
                .then(moviesDBResponse)
                .catch(e => { return e });
        }
        function moviesDBResponse(response) {
            let DB = {};
            if (response.status != 200 && response.statusText != "OK") return {};
            if (response.config.url.indexOf(vm.movieDB.typeDB.video.end) != -1) {
                /* videos */
                let video = [];
                for (let i = 0; i < response.data.results.length; i++) {
                    DB = { url: '', name: '' };
                    if (response.data.results[i].key) DB.url = $sce.trustAs($sce.RESOURCE_URL, 'https://www.youtube.com/embed/' + response.data.results[i].key);
                    if (response.data.results[i].name) DB.name = response.data.results[i].name;
                    video.push(DB);
                }
                return (response.data.results.length > 0) ? video : [];
            } else if ((response.config.url.indexOf(vm.movieDB.typeDB.discover) != -1)
                || (response.config.url.indexOf(vm.movieDB.typeDB.search) != -1)
                || (response.config.url.indexOf(vm.movieDB.typeDB.popular) != -1)
                || (response.config.url.indexOf(vm.movieDB.typeDB.topRated) != -1)
                || (response.config.url.indexOf(vm.movieDB.typeDB.upcoming) != -1)
                || (response.config.url.indexOf(vm.movieDB.typeDB.similar.end) != -1)) {
                /*  discover, search, popular, similar */
                DB.total = String(response.data.total_results);
                DB.pages = String(response.data.total_pages);
                DB.data = response.data.results;
                for (let i = 0; i < DB.data.length; i++) DB.data[i].poster = 'https://image.tmdb.org/t/p/w640' + DB.data[i].poster_path;
            } else if ((response.config.url.indexOf(vm.movieDB.typeDB.genres) != -1)) {
                /* genres */ return response.data.genres;
            } else {
                /* id */
                DB = response.data;
                DB.poster = 'https://image.tmdb.org/t/p/w640' + response.data.poster_path;
                DB.runtime = calcHrMnt(response.data.runtime);
                DB.date = calDate(response.data.release_date);
                DB.year = DB.date[0];
            }
            return DB;
        }
        //////////////////////// FUCTION ORDER /////////////////////
        /**
         * Devuelve un array con los objetos para ordenar las movies.
         */
        function getOrderBy() {
            return [
                { trans: 'popularity.asc', name: 'Menos Populares' },
                { trans: 'popularity.desc', name: 'Más Populares' },
                { trans: 'release_date.asc', name: 'Primeras películas' },
                { trans: 'release_date.desc', name: 'Últimas películas' },
                { trans: 'revenue.asc', name: 'I a' },
                { trans: 'revenue.desc', name: 'I d' },
                { trans: 'primary_release_date.asc', name: 'Primeras películas realizadas' },
                { trans: 'primary_release_date.desc', name: 'Últimas películas realizadas' },
                { trans: 'original_title.asc', name: 'Por título ascendente' },
                { trans: 'original_title.desc', name: 'Por título descendente' },
                { trans: 'vote_average.asc', name: 'Menor votación media' },
                { trans: 'vote_average.desc', name: 'Mayor votación media' },
                { trans: 'vote_count.asc', name: 'Menos votos' },
                { trans: 'vote_count.desc', name: 'Más votos' }
            ];
        };
        ///////////////////// OTHER FUCTION  //////////////////////
        function calcHrMnt(obj) {
            return parseInt(obj / 60) + 'h' + parseInt(obj % 60) + 'm';
        };
        function calDate(obj) {
            return [obj.substring(0, 4), obj.substring(5, 7), obj.substring(8, 10)];
        };
    }
})();