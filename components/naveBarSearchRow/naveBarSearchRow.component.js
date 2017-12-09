(function() {
    'use strict';
    ////////////////////////////////////////////////////////////
    // Usage:
    // Es una barra de navegador que permite navegar por
    // deferentes vista y se usa en Agend_User. Incorpora el 
    // logotipo de la web, la lista del navegador y buscador.
    // El logotipo y el buscador se pueden ocultar segun las 
    // preferencias del cliente.
    // Creates:
    // Permite ver el logotipo de la empresa, navegar por las 
    // diferentes vistas y buscar en la página web.
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .component('naveBarSearchRow', {
            templateUrl: '/components/naveBarSearchRow/naveBarSearchRow.html',
            controller: NavBarSearchRowController,
            controllerAs: '$ctrl',
            bindings: {
                boolSearch: '<',
                boolLogo: '<',
                navList: '<',
                logoImg: '@',
                logoAlt: '@',
                placeholder: '@',
                search: '=',
                changeView: '=',
                changeSearch: '&',
            },
        });
    ////////////////////////////////////////////////////////////
    NavBarSearchRowController.$inject = [];
    function NavBarSearchRowController() {
        var $ctrl = this;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();