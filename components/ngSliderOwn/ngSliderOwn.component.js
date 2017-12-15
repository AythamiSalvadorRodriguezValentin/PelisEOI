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
        .component('ngSliderOwn', {
            templateUrl: '/components/ngSliderOwn/ngSliderOwn.html',
            controller: NgSliderOwnController,
            controllerAs: '$ctrl',
            bindings: {
                slider: '=',
                changeSlider:'&'
            },
        });
    ////////////////////////////////////////////////////////////
    NgSliderOwnController.$inject = [];
    function NgSliderOwnController() {
        var $ctrl = this;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();