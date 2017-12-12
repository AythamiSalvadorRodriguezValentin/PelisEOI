(function() {
    'use strict';
    ////////////////////////////////////////////////////////////
    // Usage:
    // 
    // Creates:
    // 
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .component('filmsContainer', {
            templateUrl: '/components/filmsContainer/filmsContainer.html',
            controller: FilmsContainerController,
            controllerAs: '$ctrl',
            bindings: {
                totalFilms: '<',
                films: '<',
                filter: '<',
                boolLoad: '<',
                srcLoad: '@',
                showFilm: '&'
            },
        });
    ///////////////////////////////////////////////////////////
    FilmsContainerController.$inject = [];
    function FilmsContainerController() {
        var $ctrl = this;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();