(function() {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .factory('TheMovieDBServerProvider', TheMovieDBServerProvider);
    ////////////////////////////////////////////////////////////
    TheMovieDBServerProvider.$inject = ['$http','$sce','OmdbIDServerProvider'];
    function TheMovieDBServerProvider($http,$sce,OIDSP) {
        let vm = this;
        /////////////////////// VAR FILM ///////////////////////////
        vm.movieDB = {};
        vm.data = {};
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.movieDB.url = 'https://api.themoviedb.org/3/';
            vm.movieDB.apiKey = 'api_key=bf25fd935c58ff22732b9dd60088ff5e';
            vm.movieDB.typeDB = {
                id:{
                    type:'movie/',
                    end:'?'
                },
                discover:'discover/movie?',
                search:'search/movie?',
                popular:'movie/popular?',
                similar:{
                    type:'movie/',
                    end:'/similar?'
                },
                video:{
                    type:'movie/',
                    end:'/videos?'
                },
                genres:'genre/movie/list?'
            }
        }
        ///////////////// FUCTION FILM SERVICE /////////////////////
        var service = {
            getMovieFull:getMovieFull,
            getMoviesDB:getMoviesDB,
            getOrderBy:getOrderBy
        };
        return service;
        /////////////////////// FUCTION FILM ///////////////////////
        function getMovieFull(object){
            vm.data = {};
            let promise = new Promise(function(resolve,reject){
                getMoviesDB(object,'id')
                .then(loaded => {
                    vm.data = loaded;
                }).catch(e => reject(e));
                getMoviesDB(object,'similar')
                .then(loaded => {
                    vm.data.similar = loaded;
                }).catch(e => reject(e));
                getMoviesDB(object,'video')
                .then(loaded => {
                    vm.data.video = loaded;
                    OIDSP
                        .getMovieID(vm.data.imdb_id)
                        .then(loaded => {
                            vm.data.ombdID = loaded;
                            resolve(vm.data);
                        }).catch(e => reject(e));
                    resolve(vm.data);
                }).catch(e => reject(e));
            });
            return promise;
        };
        //////////////////////// FUCTION FILMS /////////////////////
        /**
         * 
         * @param {*} object 'Object': {id, externalID, title, language, page, sort_by, release_date_gte, release_date_lte}
         * @param {*} type 'String': type
         * type = 'id','discover','search','popular','similar','video';
         *      'id'        --> Búsqueda por ID -> necesita-> id, language, externalID.
         *      'discover'  --> Búsqueda por discover -> necesita-> language, sort_by,
         *                          filtros-> 'release_date_gte','release_date_lte'
         *      'search'    --> Búsqueda por search -> title('interestelar...'), language, page.
         *      'popular'   --> Búsqueda por populares -> necesita-> language, page.
         *      'similar'   --> Búsqueda por similares -> necesita-> id, language, page.
         *      'video'     --> Búsqueda por videos -> necesita-> id, language.
         * Examples
         * ========
         * id = '947464'.
         * externalID = 'imdb_id' o 'freebased_mid' o 'freebase_id' o 'tvdb_id' o 'tvrage_id'.
         * title = 'Interestelar'.
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
        function getMoviesDB(object, type){
            let url = '';
            if (type == 'id'){    /* id */
                url = vm.movieDB.url + vm.movieDB.typeDB[type].type + object.id + vm.movieDB.typeDB[type].end 
                    + vm.movieDB.apiKey + '&language=' + object.language + '&external_source=' + object.externalID;
            }
            else if (type == 'discover'){   /* discover */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&language=' + object.language 
                    + '&include_adult=false' + '&include_video=false' + '&page=' + object.page + '&sort_by=' + object.sort_by
                    + '&release_date.gte=' + object.release_date_gte + '&release_date_lte=' + object.release_date_lte;
            }
            else if (type == 'search'){   /* search */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&query='  + object.title
                    + '&language=' + object.language + '&include_adult=false' + '&page=' + object.page;
            }
            else if (type == 'popular'){   /* popular */
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&language=' + object.language
                    + '&include_adult=false' + '&page=' + object.page;
            }
            else if (type == 'similar'){   /* similar */
                url = vm.movieDB.url + vm.movieDB.typeDB[type].type + object.id + vm.movieDB.typeDB[type].end 
                    + vm.movieDB.apiKey + '&language=' + object.language + '&page=' + object.page;
            }
            else if (type == 'video'){   /* video */
                url = vm.movieDB.url + vm.movieDB.typeDB[type].type + object.id + vm.movieDB.typeDB[type].end 
                    + vm.movieDB.apiKey + '&language=' + object.language;
            } else if(type == 'genres'){
                url = vm.movieDB.url + vm.movieDB.typeDB[type] + vm.movieDB.apiKey + '&language=' + object.language;
            } else return {};
            return $http
                .get(url)
                .then(moviesDBResponse)
                .catch(e => {return e});
        }
        function moviesDBResponse(response){
            let DB = {};
            if (response.status == 200 && response.statusText == "OK") { 
                if(response.config.url.indexOf(vm.movieDB.typeDB.video.end) != -1){
                    /* videos */
                    let video = [];
                    for (let i = 0; i < response.data.results.length; i++){
                        DB = {url:'',name:''};
                        if (response.data.results[i].key)
                            DB.url = $sce.trustAs($sce.RESOURCE_URL, 'https://www.youtube.com/embed/' + response.data.results[i].key);
                        if (response.data.results[i].name)
                            DB.name = response.data.results[i].name;
                        video.push(DB);
                    }
                    return (response.data.results.length > 0) ? video : [];
                } else if((response.config.url.indexOf(vm.movieDB.typeDB.discover) != -1)
                        || (response.config.url.indexOf(vm.movieDB.typeDB.search) != -1)
                        || (response.config.url.indexOf(vm.movieDB.typeDB.popular) != -1)
                        || (response.config.url.indexOf(vm.movieDB.typeDB.similar.end) != -1)){
                    /*  discover, search, popular, similar */
                    DB.total = String(response.data.total_results);
                    DB.pages = String(response.data.total_pages);
                    DB.data = response.data.results;
                    for (let i = 0; i < DB.data.length; i++)
                        DB.data[i].poster = 'https://image.tmdb.org/t/p/w640' + DB.data[i].poster_path;
                } else if((response.config.url.indexOf(vm.movieDB.typeDB.genres) != -1)){
                    return response.data.genres;
                } else { /* id */
                    DB = response.data;
                    DB.poster = 'https://image.tmdb.org/t/p/w640' + response.data.poster_path;
                    DB.runtime = calcHrMnt(response.data.runtime);
                    DB.date = calDate(response.data.release_date);
                    DB.year = DB.date[0];
                }
                return DB; 
            } else return {};
        }
        //////////////////////// FUCTION ORDER /////////////////////
        function getOrderBy(){
            return ['popularity.asc','popularity.desc','release_date.asc',
                    'release_date.desc','revenue.asc','revenue.desc',
                    'primary_release_date.asc','primary_release_date.desc',
                    'original_title.asc','original_title.desc','vote_average.asc',
                    'vote_average.desc','vote_count.asc','vote_count.desc'];
        };
        ///////////////////// OTHER FUCTION  //////////////////////
        function calcHrMnt(obj){
            return parseInt(obj/60) + 'h' + parseInt(obj%60) + 'm';
        };
        function calDate(obj){
            return [obj.substring(0,4),obj.substring(5,7),obj.substring(8,10)];
        };
    }
})();