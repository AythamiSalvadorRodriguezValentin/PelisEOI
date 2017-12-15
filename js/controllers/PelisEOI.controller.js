(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['$location', 'InterfazServerFactory'];
    function PelisEOIController($location, InterSF) {
        let vm = this;
        ///////////////////////// VAR VM //////////////////////////
        vm.films = {};
        vm.film = {};
        vm.search = {};
        vm.genreList = [];
        vm.navList = [];
        vm.view = '';
        vm.orderBy = [];
        vm.slider = {};
        vm.timeout = {};
        vm.load = false;
        vm.viewFilm = false;
        vm.warning = false;
        ///////////////////////////////////////////////////////////
        /////////////////////// FUCTION VM ////////////////////////
        vm.showFilm = showFilm;
        vm.getMovies = getMovies;
        vm.changeView = changeView;
        vm.selectGenre = selectGenre;
        vm.resetFilter = resetFilter;
        vm.changeFilter = changeFilter;
        vm.checkGenreButton = checkGenreButton;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.navList = ['Descubrir', 'Próximamente', 'Mejor Valoradas', 'Mis favoritas', 'Para más tarde', 'Vistas'];
            vm.search = { title: '', genre: '', year: '', type: '', language: '', sort_by: '', page: 1 };
            vm.orderBy = InterSF.getOrderDataBy();
            fuctionGenres(vm.search, 'genres');
            vm.view = vm.navList[0];
            resetFilter('popular');
        };
        /////////////////////// FUCTION $VIEW /////////////////////////
        function changeView(nav) {
            vm.view = nav;
            if (nav == vm.navList[0]) {
                resetFilter('popular');
            } else if (nav == vm.navList[1]) {
                resetFilter('upcoming');
            } else if (nav == vm.navList[2]) {
                resetFilter('topRated');
            } else if (nav == vm.navList[3]) {
                
            } else if (nav == vm.navList[4]) {

            }
        }
        /////////////////////// FUCTION $FILM /////////////////////////
        function getMovies(str) {
            clearTimeout(vm.timeout.search);
            vm.timeout.search = setTimeout(function () {
                let type = (vm.search.title.length > 0) ? 'search' : 'popular';
                if (str === 'Y') vm.search.page++;
                else {
                    vm.search.page = 1;
                    vm.films = [];
                }
                vm.load = true;
                fuctionMovie(vm.search, type)
            }, 300);
        };
        /////////////////////// FUCTION FILTER ////////////////////////
        function changeFilter() {
            clearTimeout(vm.timeout.filter);
            vm.timeout.filter = setTimeout(getMovieFilter, 300);
        }
        function getMovieFilter() {
            for (let i = 0; i < vm.orderBy.length; i++) {
                if (vm.orderBy[i].name == vm.search.order)
                    vm.search.sort_by = vm.orderBy[i].trans;
            }
            vm.search.release_date_gte = vm.slider.minYearValue + '-01-01';
            vm.search.release_date_lte = vm.slider.maxYearValue + '-12-31';
            fuctionMovie(vm.search, 'discover');
        }
        function resetFilter(type) {
            /* Search */
            vm.search.page = 1;
            vm.search.title = '';
            vm.search.genre = '';
            vm.search.language = 'es-ES';
            vm.search.order = vm.orderBy[1].name;
            /* Slider */
            vm.slider.minYear = 1950;
            vm.slider.minYearValue = 1980;
            vm.slider.maxYear = 2050;
            vm.slider.maxYearValue = 2020;
            /* Popular */
            fuctionMovie(vm.search, type);
        }
        /////////////////////// FUCTION GENRE /////////////////////////
        function selectGenre(genre) {
            if (vm.search.genre.indexOf(genre) == -1) {
                if (vm.search.genre.length > 1) vm.search.genre += '%2C';
                vm.search.genre += genre;
            } else {
                let arrayGenre = vm.search.genre.split('%2C');
                for (let i = 0; i < arrayGenre.length; i++) {
                    if (arrayGenre[i] == genre) arrayGenre.splice(i, 1);
                }
                vm.search.genre = arrayGenre.join('%2C');
            }
            changeFilter();
        };
        function checkGenreButton(genre) {
            return (vm.search.genre.indexOf(genre) != -1) ? true : false;
        };
        ///////////////////// FUCTION SHOW VIEW ///////////////////////
        function showFilm(film) {
            if (vm.viewFilm) { vm.film = {}; vm.viewFilm = false; return; }
            film.page = 1;
            film.externalID = 'imdb_id';
            film.language = vm.search.language;
            fuctionFullMovie(film);
        };
        ///////////////////////// ERROR ///////////////////////////////
        function errorDisplay(e) {
            vm.warning = (vm.warning) ? false : true;
        }
        /////////////////// OTHER FUCTION ////////////////////////
        function fuctionGenres(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.genreList = loaded;
                }).catch(e => errorDisplay(e));
        };
        function fuctionMovie(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.films = loaded;
                    vm.load = false;
                }).catch(e => errorDisplay(e));
        };
        function fuctionFullMovie(object) {
            InterSF
                .getMovieDataFull(object)
                .then(loaded => {
                    vm.film = loaded;
                    vm.viewFilm = true;
                }).catch(e => errorDisplay(e));
        };
    }
})();