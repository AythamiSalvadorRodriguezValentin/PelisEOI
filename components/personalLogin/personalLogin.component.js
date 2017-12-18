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
                formLogin: '=',
                changeView: '&',
                message: '&',
            },
        });
    ////////////////////////////////////////////////////////////
    PersonalLoginController.$inject = ['InterfazServerFactory'];
    function PersonalLoginController(InterSF) {
        var $ctrl = this;
        $ctrl.checkButton = checkButton;
        $ctrl.push = false;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function () {
            InterSF
                .firebaseUser($ctrl.user, 'all')
                .then(loaded => {
                    $ctrl.users = loaded;
                }).catch(e => $ctrl.message({ e: (e), type: 'error' }));
            InterSF
                .firebaseSign($ctrl.user, 'now')
                .then(loaded => $ctrl.user.data = loaded)
                .catch(e => e);
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        ////////////////////////////////////////////////////////////
        function checkButton() {
            if ($ctrl.formLogin.$valid) signUser('up');
            else {
                $ctrl.push = true;
                $ctrl.message({ e: 'Introduce el correo y la contraseña', type: 'error' });
            }
        };
        //////////////////////// FUCTION SIGN /////////////////////////
        function signUser(type) {
            if (type == 'up') {
                InterSF
                    .firebaseSign($ctrl.user.login, type)
                    .then(loaded => signUser('current'))
                    .catch(e => {
                        $ctrl.user.login = {};
                        $ctrl.message({ e: e.message, type: 'error' });
                    });
            } else if (type == 'current') {
                InterSF
                    .firebaseSign($ctrl.user, type)
                    .then(loaded => {
                        $ctrl.user.login = {};
                        if (loaded != null) {
                            $ctrl.user.data = loaded;
                            $ctrl.user.auth = true;
                            InterSF
                                .firebaseUser($ctrl.user, 'all')
                                .then(loaded => {
                                    $ctrl.users = loaded;
                                    readUser();
                                }).catch(e => $ctrl.message({ e: (e), type: 'error' }));
                            $ctrl.changeView({ nav: 'Descubrir' });
                        } else {
                            $ctrl.user.auth = false;
                            $ctrl.user.sign = true;
                            $ctrl.user.data = null;
                            $ctrl.user.database = null;
                            $ctrl.message({ e: 'No estas conectado', type: 'error' });
                        }
                    }).catch(e => $ctrl.message({ e: (e), type: 'error' }));
            }
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
                    .catch(e => $ctrl.message({ e: e, type: 'error' }));
            } else $ctrl.message({ e: 'No se encuentra al usuario en la base de datos', type: 'error' });
        };
    }
})();