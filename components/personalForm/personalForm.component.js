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
                close: '&',
                message: '&',
            },
        });
    ////////////////////////////////////////////////////////////
    PersonalUserController.$inject = ['$scope', 'InterfazServerFactory'];
    function PersonalUserController($scope, InterSF) {
        var $ctrl = this;
        $ctrl.load = false;
        $ctrl.push = false;
        $ctrl.signCreateUser = signCreateUser;
        $ctrl.closeWindows = closeWindows;
        $ctrl.mssg = 'Ups, ha ocurrido algo, vuelve a intentarlo :)';
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function () {
            teclado(true);
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () {
            teclado(false);
        };
        //////////////////////// FUCTION CREATE /////////////////////////
        function signCreateUser() {
            InterSF
                .firebaseSign($ctrl.user.create, 'create')
                .then(loaded => {
                    createUser();
                    signUpdateUser();
                }).catch(e => {
                    $ctrl.message({ e: $ctrl.mssg, type: 'error' });
                    $scope.$apply($ctrl.push = true);
                });
        };
        function signUpdateUser() {
            InterSF
                .firebaseSign($ctrl.user.create, 'update')
                .then(loaded => {
                    $ctrl.close()
                    $ctrl.user.create = {};
                    $ctrl.user.login = {};
                    $ctrl.user.auth = true;
                    $scope.$apply($ctrl.user.register = false);
                }).catch(e => $ctrl.message({ e: $ctrl.mssg, type: 'error' }));
        };
        //////////////////////// FUCTION USER /////////////////////////
        function createUser() {
            InterSF
                .firebaseUser($ctrl.user.create, 'create')
                .catch(e => $ctrl.message({ e: $ctrl.mssg, type: 'error' }));
        };
        /////////////////////// FUCTION CLOSE /////////////////////////
        function closeWindows() {
            $ctrl.user.register = false;
            $ctrl.user.login = {};
            $ctrl.close();
        }
        //////////////////////// FUCTION KEY //////////////////////////
        function teclado(bool) {
            if (bool) {
                $('html').on('keydown', (e) => {
                    /* if (e.keyCode === 13) createUser(); */
                    if (e.keyCode === 27) $scope.$apply(closeWindows);
                });
            }
            else $('html').off('keydown');
        };
    }
})();