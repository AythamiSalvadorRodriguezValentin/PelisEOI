(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['PelisServerProvider'];
    function PelisEOIController(PSP) {
        let vm = this;
        ///////////////////////// VAR vm //////////////////////////
        vm.films = {data:[],total:''};
        vm.search = {};
        vm.genre = [];
        vm.load = false;
        vm.navList = [];
        vm.filter = {};
        vm.view = '';
        /////////////////////// FUCTION vm ////////////////////////
        vm.getFilms = getFilms;
        vm.selectGenero = selectGenero;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.listGenero = PSP.getGenres();
            vm.filter = {Title:'',Genre:''}
            vm.search = {Title:'',Genre:'',Year:'',Type:'movie',Plot:'full',Page:1};
            vm.navList = ['Categorías','Mejor Valoradas','Populares Ahora','Proximamente'];
        }
        /////////////////////// FUCTION vm ////////////////////////
        function getFilms(more){
            if (vm.search.Title.length >= 2) {
                vm.load = true;
                if(more === 'Y'){
                    vm.search.Page++;
                    PSP.getFilms(vm.search).then(loaded).catch(errorLoaded);
                } else {
                    vm.films = [];
                    vm.search.Page = 1;
                    vm.totalFilms = '';
                    PSP.getFilms(vm.search).then(loaded).catch(errorLoaded);
                }    
            }
        };
        function loaded(response){
            vm.load = false;
            console.log(response);
            if (response.Data && response.Total){
                for (let i = 0; i < response.Data.length; i++) vm.films.data.push(response.Data[i]);
                vm.films.total = response.Total;
            }
        };
        function errorLoaded(response){
            console.error(response);
        };
        function selectGenero(gen){
            vm.filter.Genre = gen;
        }
        /////////////////////// OTHERS FUCTION ////////////////////////
    }
})();