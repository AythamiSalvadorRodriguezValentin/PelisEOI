(function () {
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
            templateUrl: '/PelisEOI/components/filmsContainer/filmsContainer.html',
            controller: FilmsContainerController,
            controllerAs: '$ctrl',
            bindings: {
                nav:'<',
                films: '<',
                filter: '<',
                boolLoad: '<',
                showFilm: '&',
                elementsUser: '&',
            },
        });
    ///////////////////////////////////////////////////////////
    FilmsContainerController.$inject = [];
    function FilmsContainerController() {
        var $ctrl = this;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }
})();