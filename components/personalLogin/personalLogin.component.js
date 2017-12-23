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
        .component('personalLogin', {
            templateUrl: '/components/personalLogin/personalLogin.html',
            controller: PersonalLoginController,
            controllerAs: '$ctrl',
            bindings: {
                user: '=',
                users: '=',
                message: '&',
            },
        });
    ////////////////////////////////////////////////////////////
    PersonalLoginController.$inject = ['InterfazServerFactory', '$scope'];
    function PersonalLoginController(InterSF, $scope) {
        var $ctrl = this;
        $ctrl.push = false;
        $ctrl.load = false;
        $ctrl.checkButton = checkButton;
        $ctrl.mssg = 'No es posible establecer la conexión con la base de datos';
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function () {
            teclado(true);
            init();
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () {
            teclado(false);
        };
        ////////////////////////////////////////////////////////////
        function checkButton() {
            if ($ctrl.user.formLogin.$valid) {
                $ctrl.load = true;
                signUser();
            }
            else {
                $ctrl.message({ e: 'Introduce el correo y la contraseña', type: 'error' });
                $scope.$apply($ctrl.push = true);
            }
        };
        //////////////////////// FUCTION SIGN /////////////////////////
        function signUser() {
            InterSF
                .firebaseSign($ctrl.user.login, 'up')
                .then(loaded => init())
                .catch(e => {
                    $ctrl.user.login = {};
                    $ctrl.push = true;
                    if (e.message.indexOf('A network error') != -1) $ctrl.message({ e: 'No hay conexión a internet', type: 'error' });
                    else if (e.message.indexOf('The password is invalid') != -1) $ctrl.message({ e: 'La contraseña no es válida', type: 'error' });
                    else if (e.message.indexOf('The email address is badly formatted') != -1) $ctrl.message({ e: 'El correo no es válido', type: 'error' });
                    else $ctrl.message({ e: e.message, type: 'error' });
                    $scope.$apply($ctrl.load = false);
                });
        };
        //////////////////////// FUCTION USER /////////////////////////
        function readUser() {
            let user = {};
            let isIn = false;
            for (let i = 0; i < $ctrl.users.length; i++) {
                if ($ctrl.users[i].email == $ctrl.user.data.email) {
                    user = $ctrl.users[i];
                    isIn = true;
                }
            }
            if (isIn) {
                InterSF
                    .firebaseUser(user, 'user')
                    .then(loaded => $ctrl.user.database = loaded)
                    .catch(e => $ctrl.message({ e: $ctrl.mssg, type: 'error' }));
            } else $ctrl.message({ e: 'No se encuentra al usuario en la base de datos', type: 'error' });
        };
        //////////////////////// FUCTION INIT /////////////////////////
        function init() {
            InterSF
                .firebaseUser($ctrl.user, 'all')
                .then(loaded => $ctrl.users = loaded)
                .catch(e => $ctrl.message({ e: $ctrl.mssg, type: 'error' }));
            InterSF
                .firebaseSign($ctrl.user, 'now')
                .then(loaded => {
                    $ctrl.user.login = {};
                    $ctrl.load = false;
                    $ctrl.user.data = loaded;
                    $ctrl.user.auth = true;
                    $ctrl.user.anonimo = false;
                    $scope.$apply($ctrl.user.sign = false);
                    InterSF
                        .firebaseUser($ctrl.user, 'all')
                        .then(loaded => {
                            $ctrl.users = loaded;
                            readUser();
                        }).catch(e => $ctrl.message({ e: $ctrl.mssg, type: 'error' }));
                }).catch(e => {
                    $ctrl.user.auth = false;
                    $ctrl.user.data = null;
                    $ctrl.user.database = null;
                    $ctrl.user.anonimo = false;
                    $scope.$apply($ctrl.user.sign = true);
                });
        }
        //////////////////////// FUCTION KEY //////////////////////////
        function teclado(bool) {
            if (bool) {
                $('html').on('keydown', (e) => {
                    if (e.keyCode === 13) checkButton();
                    if (e.keyCode === 27) $scope.$apply($ctrl.user.sign = false);
                });
            }
            else $('html').off('keydown');
        };
    }
})();