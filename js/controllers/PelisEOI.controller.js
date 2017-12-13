(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['$location','OmdbIDServerProvider','TheMovieDBServerProvider'];
    function PelisEOIController($location,OIDSP,TMDBSP) {
        let vm = this;
        ///////////////////////// VAR VM //////////////////////////
        vm.films = {};
        vm.film = {};
        vm.search = {};
        vm.genreList = [];
        vm.load = false;
        vm.navList = [];
        vm.view = 'Descubrir';
        vm.viewFilm = false;
        ///////////////////////////////////////////////////////////
        /////////////////////// FUCTION VM ////////////////////////
        vm.showFilm = showFilm;
        vm.getMovies = getMovies;
        vm.selectGenre = selectGenre;
        vm.checkGenreButton = checkGenreButton;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.genreList = OIDSP.getGenres();
            vm.search = {title:'',genre:'',year:'',type:'',language:'',page:1};
            vm.navList = ['Descubrir','Próximamente','Mis favoritas','Para más tarde','Vistas'];
        };
        /////////////////////// FUCTION $FILM /////////////////////////
        function getMovies(more){
            if (vm.search.title.length >= 2) {
                vm.load = true;
                vm.search.type = 'movie';
                vm.search.language = 'es-ES';
                if(more === 'Y'){
                    vm.search.page++;
                    TMDBSP
                    .getMoviesDBSearch(vm.search)
                    .then(loaded => {
                        vm.films = loaded;
                        vm.load = false;
                    }).catch(e => console.error(e));
                } else {
                    vm.search.page = 1;
                    vm.films = [];
                    TMDBSP
                        .getMoviesDBSearch(vm.search)
                        .then(loaded => {
                            vm.films = loaded;
                            vm.load = false;
                        }).catch(e => console.error(e));
                }    
            }
        };
        /////////////////////// FUCTION GENRE  ////////////////////////
        function selectGenre(genre){
            if (vm.search.genre.indexOf(genre) == -1) {
                if(vm.search.genre.length > 1) vm.search.genre += ', ';
                vm.search.genre += genre;
            } else {
                let arrayGenre = vm.search.genre.split(', ');
                for(let i = 0; i < arrayGenre.length; i++){
                    if(arrayGenre[i] == genre) arrayGenre.splice(i,1);
                }
                vm.search.genre = arrayGenre.join(', ');
            }
        };
        function checkGenreButton(genre){
            return (vm.search.genre.indexOf(genre) != -1) ? true : false;
        };
        ///////////////////// FUCTION SHOW VIEW  //////////////////////
        function showFilm(film){
            film.language = 'es-ES';
            film.page = 1;
            TMDBSP
                .getMovieDBID(film)
                .then(loaded => {
                    vm.film = loaded;
                }).catch(e => console.error(e));
            TMDBSP
                .getMoviesDBSimilar(film)
                .then(loaded => {
                    vm.film.similar = loaded;
                }).catch(e => console.error(e));
            TMDBSP
                .getMoviesDBVideo(film)
                .then(loaded => {
                    vm.film.video = loaded;
                }).catch(e => console.error(e));
            OIDSP
                .getMovie(film)
                .then(loaded => {
                    vm.film.ombdID = loaded;
                    vm.viewFilm = true;
                }).catch(e => console.error(e));
        };
    }
})();