(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['$location','InterfazServerFactory'];
    function PelisEOIController($location,InterSF) {
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
            vm.orderBy = InterSF.getOrderDataBy();
            vm.navList = ['Descubrir','Próximamente','Mis favoritas','Para más tarde','Vistas'];
            vm.search = {title:'',genre:'',year:'',type:'',language:'',sort_by:'',page:1};
            vm.view = vm.navList[0];
            resetFilter();
            InterSF
                .getMoviesData(vm.search,'genres')
                .then(loaded => vm.genreList = loaded)
                .catch(e => errorDisplay(e));
        };
        /////////////////////// FUCTION $VIEW /////////////////////////
        function changeView(nav){
            vm.view = nav;
            if (nav == vm.navList[0]) {
                resetFilter();
            } else if(nav == vm.navList[1]){
                vm.films = {};
            } else if(nav == vm.navList[2]){
                
            } else if(nav == vm.navList[3]){
                
            } else if(nav == vm.navList[4]){
                
            }
        }
        /////////////////////// FUCTION $FILM /////////////////////////
        function getMovies(more){
            if (vm.search.title.length >= 2) {
                vm.load = true;
                if(more === 'Y'){
                    vm.search.page++;
                } else {
                    vm.search.page = 1;
                    vm.films = [];
                }
                InterSF
                    .getMoviesData(vm.search,'search')
                    .then(loaded => {
                        vm.films = loaded;
                        vm.load = false;
                    }).catch(e => errorDisplay(e));
            }
        };
        /////////////////////// FUCTION FILTER ////////////////////////
        function changeFilter(){
            clearTimeout(vm.timeout.filter);
            vm.timeout.filter = setTimeout(getMovieDiscover,300);
        }
        function resetFilter(){
            /* Genres */
            vm.search.genre = '';
            /* Search */
            vm.search.language = 'es-ES';
            vm.search.sort_by = vm.orderBy[1];
            /* Slider */
            vm.slider.minYear = 1950;
            vm.slider.minYearValue = 2000;
            vm.slider.maxYear = 2050;
            vm.slider.maxYearValue = 2000;
            /* Popular */
            InterSF
                .getMoviesData(vm.search,'popular')
                .then(loaded => {
                    vm.films = loaded;
                    vm.load = false;
                }).catch(e => errorDisplay(e));
        }
        /////////////////////// FUCTION DISCOVER ////////////////////////
        function getMovieDiscover(){
            vm.search.sort_by = vm.search.sort_by;
            vm.search.release_date_gte = vm.slider.minYearValue + '-01-01';
            vm.search.release_date_lte = vm.slider.maxYearValue + '-12-31';
            InterSF
                .getMoviesData(vm.search,'discover')
                .then(loaded => {
                    vm.films = loaded;
                    vm.load = false;
                }).catch(e => errorDisplay(e));
        }
        /////////////////////// FUCTION GENRE /////////////////////////
        function selectGenre(genre){
            if (vm.search.genre.indexOf(genre) == -1) {
                if(vm.search.genre.length > 1) vm.search.genre += '%2C';
                vm.search.genre += genre;
            } else {
                let arrayGenre = vm.search.genre.split('%2C');
                for(let i = 0; i < arrayGenre.length; i++){
                    if(arrayGenre[i] == genre) arrayGenre.splice(i,1);
                }
                vm.search.genre = arrayGenre.join('%2C');
            }
            changeFilter();
        };
        function checkGenreButton(genre){
            return (vm.search.genre.indexOf(genre) != -1) ? true : false;
        };
        ///////////////////// FUCTION SHOW VIEW ///////////////////////
        function showFilm(film){
            film.language = vm.search.language;
            film.externalID = 'imdb_id';
            film.page = 1;
            InterSF
                .getMovieDataFull(film)
                .then(loaded => {
                    vm.film = loaded;
                    vm.viewFilm = true;
                }).catch(e => errorDisplay(e));
        };
        ///////////////////////// ERROR ///////////////////////////////
        function errorDisplay(e){
            vm.warning = (vm.warning) ? false : true;
        }
    }
})();