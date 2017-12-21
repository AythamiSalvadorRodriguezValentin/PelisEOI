(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('UsersLocalProvider', UsersLocalProvider);

    UsersLocalProvider.$inject = [];
    function UsersLocalProvider() {
        var service = {
            /////////// USERS /////////////
            getUsers: getUsers,
            getUser: getUser,
            updateUser: updateUser,
            addUser: addUser,
            removeUser: removeUser,
            getAnon: getAnon,
            updateAnom: updateAnom,
            removeAnom: removeAnom,
            /////////// EDITOR USER /////////////
            getEditUser: getEditUser,
            updateEditUser: updateEditUser,
            /////////// VAR EDIT /////////////
            getEdit: getEdit,
            updateEdit: updateEdit,
            /////////// FILTROS /////////////
            getFilter: getFilter,
            updateFilter: updateFilter
        };

        return service;
        ///////////////////////////////// USERS ///////////////////////////
        function getUsers() {
            if ('listUsers' in localStorage) {
                return JSON.parse(localStorage.getItem('listUsers'));
            } else {
                return [];
            }
        };
        function getUser(id) {
            let users = getUsers();
            for (let i = 0; i < users.length; i++)
                if (users[i].id == id) return users[i];
            return [];
        };
        function updateUser(user) {
            let users = getUsers();
            for (let i = 0; i < users.length; i++) {
                if (users[i].id == user.id) {
                    users[i] = user;
                }
            }
            localStorage.setItem('listUsers', JSON.stringify(users));
        };
        function addUser(user) {
            let users = getUsers();
            users.push(user);
            localStorage.setItem('listUsers', JSON.stringify(users));
        };
        function removeUser(ident) {
            let users = getUsers();
            for (let i = 0; i < users.length; i++) {
                if (users[i].id == ident) {
                    users[i].splice(i, 1);
                }
            }
            localStorage.setItem('listUsers', JSON.stringify(users));
        };
        function getAnon() {
            return ('anomUser' in localStorage) ? JSON.parse(localStorage.getItem('anomUser')) : {};
        }
        function updateAnom(anom) {
            localStorage.setItem('anomUser', JSON.stringify(anom));
        }
        function removeAnom() {
            if ('anomUser' in localStorage) JSON.parse(localStorage.setItem('anomUser', {}));
        }
        ///////////////////////////////// EDITOR USER ///////////////////////////
        function getEditUser() {
            if ('editUser' in localStorage) {
                return JSON.parse(localStorage.getItem('editUser'));
            } else {
                return [];
            }
        };
        function updateEditUser(editUser) {
            localStorage.setItem('editUser', JSON.stringify(editUser));
        };
        ///////////////////////////////// VAR EDIT ///////////////////////////
        function getEdit() {
            if ('editVar' in localStorage) {
                return JSON.parse(localStorage.getItem('editVar'));
            } else {
                return false;
            }
        };
        function updateEdit(varEdit) {
            localStorage.setItem('editVar', JSON.stringify(varEdit));
        };
        ///////////////////////////////// FILTROS ///////////////////////////
        function getFilter() {
            if ('filterUser' in localStorage) {
                return JSON.parse(localStorage.getItem('filterUser'));
            } else {
                return false;
            }
        };
        function updateFilter(filter) {
            localStorage.setItem('filterUser', JSON.stringify(filter));
        };
    }
})();