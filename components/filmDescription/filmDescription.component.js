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
        .component('filmDescription', {
            templateUrl: '/components/filmDescription/filmDescription.html',
            controller: FilmDescriptionController,
            controllerAs: '$ctrl',
            bindings: {
                film: '=',
            },
        });
    ////////////////////////////////////////////////////////////
    FilmDescriptionController.$inject = [];
    function FilmDescriptionController() {
        var $ctrl = this;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();