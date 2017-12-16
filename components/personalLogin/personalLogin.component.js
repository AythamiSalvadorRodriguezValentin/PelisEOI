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
        .component('personalLogin', {
            templateUrl: '/components/personalLogin/personalLogin.html',
            controller: PersonalLoginController,
            controllerAs: '$ctrl',
            bindings: {
                user: '=',
                signUser: '&',
                message:'&'
            },
        });
    ////////////////////////////////////////////////////////////
    PersonalLoginController.$inject = [];
    function PersonalLoginController() {
        var $ctrl = this;
        $ctrl.checkButton = checkButton;
        $ctrl.push = false;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
        ////////////////////////////////////////////////////////////
        function checkButton(){
            if($ctrl.formLogin.$valid)$ctrl.signUser({type:'up'});
            else{
                $ctrl.push = true;
                $ctrl.message({e:'Introduce el correo y la contraseña'});
            }
        };
    }
})();