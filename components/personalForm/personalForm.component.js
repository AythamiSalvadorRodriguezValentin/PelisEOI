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
        $ctrl.passwordCheck = false;
        $ctrl.signCreateUser = signCreateUser;
        $ctrl.closeWindows = closeWindows;
        $ctrl.changeSign = changeSign;
        $ctrl.checkPass = checkPass;
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
            $ctrl.load = true;
            if ($ctrl.user.form.$invalid) {
                $ctrl.push = true;
                $ctrl.load = false;
                $ctrl.message({ e: 'Ups, los argumentos no son válidos', type: 'error' });
                return;
            } if (!$ctrl.passwordCheck) {
                $ctrl.push = true;
                $ctrl.load = false;
                $ctrl.user.create.password = "";
                $ctrl.user.create.passwordRepit = "";
                $ctrl.message({ e: 'Ups, las contraseñas no coinciden', type: 'error' });
                return;
            }
            createAccount();
        };
        //////////////////// FUCTION ACCOUNT ///////////////////////
        function createAccount() {
            InterSF
                .firebaseSign($ctrl.user.create, 'create')
                .then(loaded => {
                    if (loaded.indexOf('created') != -1) settingsAccount();
                    else $ctrl.message({ e: $ctrl.mssg, type: 'error' });
                }).catch(e => {
                    if (e.message.indexOf('A network error') != -1)
                        $ctrl.message({ e: 'Ups, no hay conexión a internet', type: 'error' });
                    else if (e.message.indexOf("Cannot read property 'email' of undefined") != -1)
                        $ctrl.message({ e: 'Introduce el correo y la contraseña', type: 'error' });
                    else if (e.message.indexOf("createUserWithEmailAndPassword failed: First argument " + '"email"' + " must be a valid string.") != -1)
                        $ctrl.message({ e: 'Ups, el correo no es válido', type: 'error' });
                    else if (e.message.indexOf("createUserWithEmailAndPassword failed: Second argument " + '"password"' + " must be a valid string.") != -1)
                        $ctrl.message({ e: 'Ups, la contraseña no es válida', type: 'error' });
                    else if (e.message.indexOf('The email address is already in use by another account.') != -1)
                        $ctrl.message({ e: 'Ups, este correo ya no esta disponible, prueba con otro :)', type: 'error' });
                    else $ctrl.message({ e: e.message, type: 'error' });
                    $ctrl.load = false;
                    $scope.$apply($ctrl.push = true);
                });
        }
        //////////////////// FUCTION SETTINGS ///////////////////////
        function settingsAccount() {
            Promise.all
                ([InterSF.firebaseUser($ctrl.user, 'all'),
                InterSF.firebaseUser($ctrl.user.create, 'create'),
                InterSF.firebaseSign($ctrl.user.create, 'update'),
                InterSF.firebaseSign($ctrl.user, 'now')])
                .then(loaded => {
                    $ctrl.user.auth = true;
                    $ctrl.user.anonimo = false;
                    $ctrl.user.data = loaded[3];
                    $ctrl.users = loaded[0];
                    readUser();
                }).catch(e => {
                    $ctrl.load = false;
                    $ctrl.user.auth = false;
                    $ctrl.user.anonimo = true;
                    $ctrl.user.data = null;
                    $ctrl.user.database = InterSF.anonimoUserLocalStorage($ctrl.user, 'get');
                    if (!$ctrl.user.database) $ctrl.user.database = { fav: [], see: [], saw: [] };
                    $scope.$apply($ctrl.user.sign = true);
                });
        }
        ////////////////////// FUCTION USER ///////////////////////
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
                        $ctrl.user.database = loaded;
                        $scope.$apply(closeWindows);
                    }).catch(e => {
                        $scope.$apply($ctrl.message({ e: $ctrl.mssg, type: 'error' }));
                    });
            } else $ctrl.message({ e: $ctrl.mssg, type: 'error' });
        };
        ////////////////////// FUCTION CHECK //////////////////////////
        function checkPass() {
            if ($ctrl.user.create.password == $ctrl.user.create.passwordRepit) $ctrl.passwordCheck = true;
            else $ctrl.passwordCheck = false;
        }
        /////////////////////// FUCTION CLOSE /////////////////////////
        function closeWindows() {
            $ctrl.user.register = false;
            $ctrl.user.create = {};
            $ctrl.load = false;
            $ctrl.close();
        }
        /////////////////////// FUCTION SIGN //////////////////////////
        function changeSign() {
            $ctrl.user.register = false;
            $ctrl.user.sign = true;
        }
        //////////////////////// FUCTION KEY //////////////////////////
        function teclado(bool) {
            if (bool) {
                $('html').on('keydown', (e) => {
                    if (e.keyCode === 13) $scope.$apply(signCreateUser);
                    if (e.keyCode === 27) $scope.$apply(closeWindows);
                });
            }
            else $('html').off('keydown');
        };
    }
})();