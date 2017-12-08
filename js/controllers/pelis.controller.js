(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['PelisServerProvider'];
    function PelisEOIController(PSP) {
        let vm = this;
        ///////////////////////// VAR vm //////////////////////////
        vm.pelisList = [];
        vm.search = {Title:'',Genre:''};
        vm.listGenero = [];
        vm.load = false;
        vm.navList = [];
        vm.showView = '';
        /////////////////////// FUCTION vm ////////////////////////
        vm.getPeli = getPeli;
        vm.selectGenero = selectGenero;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.listGenero = PSP.getGeneros();
            vm.navList = ['Categorías','Mejor Valoradas','Populares Ahora','Proximamente'];
        }
        /////////////////////// FUCTION vm ////////////////////////
        function getPeli(){
            vm.load = true;
            vm.pelisList = [];
            vm.totalPelis = '';
            if(vm.search.Title.length > 0) 
                PSP.getPelis(vm.search.Title).then(successFuction1).catch(errorFuction);
            if (vm.search.length == 0) 
                vm.load = false;
        };
        function successFuction1(response){
            if(response.Response && response.Search && response.totalResults) {
                vm.totalPelis = response.totalResults;
                for (let i = 0; i < response.Search.length; i++) {
                    const p = response.Search[i];
                    PSP.getPeli(p.Title,{bool:false}).then(successFuction2).catch(errorFuction);
                }
            }
        };
        function successFuction2(response){
            if(response.Response) vm.pelisList.push(response);
            vm.load = false;
            console.log(response);
        };
        function errorFuction(response){
            console.log(response);
        };
        function selectGenero(gen){
            vm.search.Genre = gen;
            /*let genre = vm.search.Genre.split(",");
            if (genre.includes(gen)) {
                let i = genre.indexOf(gen);
                genre.splice(i,1);
                vm.search.Genre = genre.join(",");
            } else{
                vm.search.Genre += String(gen) + ",";
            }
            console.log(vm.search.Genre);*/
        }
        /////////////////////// OTHERS FUCTION ////////////////////////
    }
})();