(function () {
    'use strict';
    ////////////////////////////////////////////////////////////
    // Usage:
    // Se utiliza para rellenar los datos de un cliente externo 
    // en un formulario.
    // Creates:
    // Se utiliza en la aplicación Agend_User y se creo para
    // introducir datos de un usuario externo a la app.
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .component('personalForm', {
            templateUrl: '/components/personalForm/personalForm.html',
            controller: PersonalUserController,
            controllerAs: '$ctrl',
            bindings: {
                user: '=',
                form: '=',
                message: '&',
            },
        });
    ////////////////////////////////////////////////////////////
    PersonalUserController.$inject = ['$scope','InterfazServerFactory'];
    function PersonalUserController($scope,InterSF) {
        var $ctrl = this;
        $ctrl.signCreateUser = signCreateUser;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        //////////////////////// FUCTION USER /////////////////////////
        function createUser() {
            InterSF
                .firebaseUser($ctrl.user.create, 'create')
                .catch(e => $ctrl.message({ e: e, type: 'error' }));
        };
        //////////////////////// FUCTION CREATE /////////////////////////
        function signCreateUser() {
            InterSF
                .firebaseSign($ctrl.user.create, 'create')
                .then(loaded => {
                    $ctrl.user.auth = false;
                    $ctrl.user.sign = true;
                    createUser();
                    signUpdateUser();
                }).catch(e => $ctrl.message({ e: e, type: 'error' }));
        };
        function signUpdateUser() {
            InterSF
                .firebaseSign($ctrl.user.create, 'update')
                .then(loaded => {
                    $ctrl.user.create = {};
                    $ctrl.user.login = {};
                    $scope.$apply($ctrl.message({ e: 'Registro completado. Inicia Sesion' }));
                }).catch(e => $ctrl.message({ e: e, type: 'error' }));
        }
    }
})();