(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['$location','PelisServerProvider'];
    function PelisEOIController($location,PSP) {
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
        vm.getFilms = getFilms;
        vm.selectGenre = selectGenre;
        vm.checkGenreButton = checkGenreButton;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.films = {Data:[],Total:''};
            vm.genreList = PSP.getGenres();
            vm.search = {Title:'',Genre:'',Year:'',Type:'',Plot:'',Page:1};
            vm.navList = ['Descubrir','Mejor Valoradas','Populares Ahora','Proximamente'];
        };
        /////////////////////// FUCTION $FILM /////////////////////////
        function getFilms(more){
            if (vm.search.Title.length >= 2) {
                vm.load = true;
                vm.search.Type = 'movie';
                vm.search.Plot = 'full';
                if(more === 'Y'){
                    vm.search.Page++;
                    PSP 
                        .getFilms(vm.search)
                        .then(loaded => {vm.films = loaded; vm.load = false})
                        .catch(e => console.error(e));
                } else {
                    vm.films = [];
                    vm.search.Page = 1;
                    vm.totalFilms = '';
                    PSP 
                        .getFilms(vm.search)
                        .then(loaded => {vm.films = loaded; vm.load = false})
                        .catch(e => console.error(e));
                }    
            }
        };
        /////////////////////// FUCTION GENRE  ////////////////////////
        function selectGenre(genre){
            if (vm.search.Genre.indexOf(genre) == -1) {
                if(vm.search.Genre.length > 1) vm.search.Genre += ', ';
                vm.search.Genre += genre;
            } else {
                let arrayGenre = vm.search.Genre.split(', ');
                for(let i = 0; i < arrayGenre.length; i++){
                    if(arrayGenre[i] == genre) arrayGenre.splice(i,1);
                }
                vm.search.Genre = arrayGenre.join(', ');
            }
        }
        function checkGenreButton(genre){
            return (vm.search.Genre.indexOf(genre) != -1) ? true : false;
        }
        ///////////////////// FUCTION SHOW VIEW  //////////////////////
        function showFilm(film){
            vm.film = film;
            vm.viewFilm = true;
        }
    }
})();