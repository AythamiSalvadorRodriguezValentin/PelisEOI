(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['PelisServerProvider'];
    function PelisEOIController(PSP) {
        let vm = this;
        ///////////////////////// VAR vm //////////////////////////
        vm.films = {Data:[],Total:''};
        vm.search = {};
        vm.genreList = [];
        vm.load = false;
        vm.navList = [];
        vm.view = '';
        ///////////////////////////////////////////////////////////
        vm.slider1 = {};
        /////////////////////// FUCTION vm ////////////////////////
        vm.getFilms = getFilms;
        vm.selectGenre = selectGenre;
        vm.checkGenreButton = checkGenreButton;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.genreList = PSP.getGenres();
            vm.search = {Title:'',Genre:'',Year:'',Type:'',Plot:'',Page:1};
            vm.navList = ['Categorías','Mejor Valoradas','Populares Ahora','Proximamente'];
            /*Slider*/
            vm.slider1 = {
                minValue: 10,
                maxValue: 90,
                options: {
                    floor: 0,
                    ceil: 100,
                    step: 1,
                    noSwitching: true
                }
            };
        }
        /////////////////////// FUCTION $FILM /////////////////////////
        function getFilms(more){
            if (vm.search.Title.length >= 2) {
                vm.load = true;
                vm.search.Type = 'movie';
                vm.search.Type = 'full';
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
        /////////////////////// OTHERS FUCTION ////////////////////////
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
    }
})();