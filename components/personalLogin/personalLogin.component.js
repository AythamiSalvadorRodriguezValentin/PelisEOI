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
            templateUrl: '/PelisEOI/components/personalLogin/personalLogin.html',
            controller: PersonalLoginController,
            controllerAs: '$ctrl',
            bindings: {
                user: '=',
                users: '=',
                close: '&',
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
        $ctrl.closeWindows = closeWindows;
        $ctrl.mssg = 'Ups, ha ocurrido algo, vuelve a intentarlo :)';
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
            $ctrl.load = true;
            signUser();
        };
        //////////////////////// FUCTION SIGN /////////////////////////
        function signUser() {
            InterSF
                .firebaseSign($ctrl.user.login, 'up')
                .then(loaded => init())
                .catch(e => {
                    if (e.message.indexOf('A network error') != -1)
                        $ctrl.message({ e: 'Ups, no hay conexión a internet', type: 'error' });
                    else if (e.message.indexOf('The password is invalid') != -1)
                        $ctrl.message({ e: 'Ups, la contraseña no es válida', type: 'error' });
                    else if (e.message.indexOf('The email address is badly formatted') != -1)
                        $ctrl.message({ e: 'Ups, el correo no es válido', type: 'error' });
                    else if (e.message.indexOf("Cannot read property 'email' of undefined") != -1)
                        $ctrl.message({ e: 'Introduce el correo y la contraseña', type: 'error' });
                    else if (e.message.indexOf("signInWithEmailAndPassword failed: First argument " + '"email"' + " must be a valid string.") != -1)
                        $ctrl.message({ e: 'Ups, el correo no es válida', type: 'error' });
                    else if (e.message.indexOf("signInWithEmailAndPassword failed: Second argument " + '"password"' + " must be a valid string.") != -1)
                        $ctrl.message({ e: 'Ups, la contraseña no es válida', type: 'error' });
                    else $ctrl.message({ e: e.message, type: 'error' });
                    $ctrl.user.login = {};
                    $ctrl.push = true;
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
                    .then(loaded => {
                        $ctrl.close();
                        $ctrl.load = false;
                        $ctrl.user.sign = false;
                        $scope.$apply($ctrl.user.database = loaded);
                    }).catch(e => $ctrl.message({ e: $ctrl.mssg, type: 'error' }));
            } else $ctrl.message({ e: 'No se encuentra al usuario en la base de datos', type: 'error' });
        };
        //////////////////////// FUCTION INIT /////////////////////////
        function init() {
            InterSF
                .firebaseSign($ctrl.user, 'now')
                .then(loaded => {
                    $ctrl.user.login = {};
                    $ctrl.user.data = loaded;
                    $ctrl.user.auth = true;
                    $ctrl.user.anonimo = false;
                    InterSF
                        .firebaseUser($ctrl.user, 'all')
                        .then(loaded => {
                            $ctrl.users = loaded;
                            readUser();
                        }).catch(e => {
                            $ctrl.load = false;
                            $ctrl.message({ e: $ctrl.mssg, type: 'error' })
                        });
                }).catch(e => {
                    $ctrl.load = false;
                    $ctrl.user.auth = false;
                    $ctrl.user.anonimo = true;
                    $ctrl.user.data = null;
                    $ctrl.user.database = InterSF.anonimoUserLocalStorage(vm.user, 'get');
                    if (!vm.user.database) vm.user.database = { fav: [], see: [], saw: [] };
                    $scope.$apply($ctrl.user.sign = true);
                });
        }
        /////////////////////// FUCTION CLOSE /////////////////////////
        function closeWindows() {
            $ctrl.user.sign = false;
            $ctrl.user.login = {};
            $ctrl.close();
        }
        //////////////////////// FUCTION KEY //////////////////////////
        function teclado(bool) {
            if (bool) {
                $('html').on('keydown', (e) => {
                    if (e.keyCode == 13) $scope.$apply(checkButton);
                    if (e.keyCode == 27) $scope.$apply(closeWindows);
                });
            }
            else $('html').off('keydown');
        };
    }
})();