(function() {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('InterfazServerFactory', InterfazServerFactory);

    InterfazServerFactory.$inject = ['OmdbIDServerProvider','TheMovieDBServerProvider'];
    function InterfazServerFactory(OIDSP,TMDBSP){
        let vm = this;
        vm.data = {};
        ////////////////////////////////////////////////////////////
        var service = {
            getMoviesData:getMoviesData,
            getMovieDataFull:getMovieDataFull,
            getOrderDataBy:getOrderDataBy
        };
        return service;
        ////////////////////////////////////////////////////////////
        function getMoviesData(object,type){
            return TMDBSP
                    .getMoviesDB(object,type)
                    .then(loaded => {return loaded})
                    .catch(e => {return e});
        };
        ////////////////////////////////////////////////////////////
        function getMovieDataFull(object){
            return TMDBSP
                    .getMovieFull(object)
                    .then(loaded => {return loaded})
                    .catch(e => {return e});
        };
        ////////////////////////////////////////////////////////////
        function getOrderDataBy(){
            return TMDBSP.getOrderBy();
        };
    }
})();