(function () {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .controller('RegisterUserController', RegisterUserController);
    ////////////////////////////////////////////////////////////
    RegisterUserController.$inject = [];
    function RegisterUserController() {
        var vm = this;
        vm.user = {};
        vm.messageDisplay = messageDisplay;
        vm.pushRegistrer = pushRegistrer;
        vm.anonimoUser = anonimoUser;
        activate();
        ////////////////////////////////////////////////////////////
        function activate() {

        }
        ///////////////////////// MESSAGE /////////////////////////////
        function messageDisplay(e, type) {
            vm.message = e;
            vm.viewMessage = true;
            vm.messageType = (type == 'error') ? false : true;
            clearTimeout(vm.timeout.show);
            vm.timeout.message = setTimeout(() => {
                vm.viewMessage = false;
                $scope.$apply();
            }, 3000);
        };
        ////////////////////// FUCTION REGISTER ///////////////////////
        function pushRegistrer() {
            vm.user.sign = false;
            messageDisplay('Rellena el formulario para registrarte');
        };
        ////////////////// FUCTION ANONIMO USER ///////////////////////
        function anonimoUser() {
            vm.user.auth = true;
            vm.user.anonimo = true;
            vm.user.database = { fav: [], see: [], saw: [] }
            changeView(vm.navList[0]);
        }
    }
})();