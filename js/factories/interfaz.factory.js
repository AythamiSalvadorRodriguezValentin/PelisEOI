(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('InterfazServerFactory', InterfazServerFactory);

    InterfazServerFactory.$inject = ['TheMovieDBServerProvider', 'FirebaseServiceProvider'];
    function InterfazServerFactory(TMDBSP, FSP) {
        let vm = this;
        vm.data = {};
        ////////////////////////////////////////////////////////////
        var service = {
            getMoviesData: getMoviesData,
            getMovieDataFull: getMovieDataFull,
            getOrderDataBy: getOrderDataBy,
            firebaseSign: firebaseSign,
            firebaseUser: firebaseUser,
            indexArray: indexArray
        };
        return service;
        ////////////////////////////////////////////////////////////
        function getMoviesData(object, type) {
            return TMDBSP
                .getMoviesDB(object, type)
                .then(loaded => { return loaded })
                .catch(e => { return e });
        };
        ////////////////////////////////////////////////////////////
        function getMovieDataFull(object) {
            return TMDBSP
                .getMovieFull(object)
                .then(loaded => { return loaded })
                .catch(e => { return e });
        };
        ////////////////////////////////////////////////////////////
        function getOrderDataBy() {
            return TMDBSP.getOrderBy();
        };
        ////////////////////// FIREBASE SIGN ///////////////////////
        /**
         * 
         * @param {*} user 'object': {id:'',name:'',...}
         * @param {*} type 'String': all, create, update, delete.
         * all --> Devuelve todos los usuarios.
         * user --> Devuelve un usuario
         * create --> crea datos para un nuevo usuario.
         * update --> actualiza un usuario.
         * delete --> elimina los datos de un usuario. 
         * 
         */
        function firebaseSign(user, type) {
            if (type == 'create') {
                return FSP
                    .createUserWithEmailAndPasswordUser(user)
                    .then(loaded => { return loaded; })
                    .catch(e => { return e; });
            } else if (type == 'up') {
                return FSP
                    .signInWithEmailAndPasswordUser(user)
                    .then(loaded => { return loaded; })
                    .catch(e => { return e; });
            } else if (type == 'out') {
                return FSP
                    .signOutUser()
                    .then(loaded => { return loaded; })
                    .catch(e => { return e; });
            } else if (type == 'update') {
                return FSP
                    .updateUser(user)
                    .then(loaded => { return loaded; })
                    .catch(e => { return e; });
            } else if (type == 'current') {
                return FSP.currentUser();
            }
        }
        ///////////////////// FIREBASE USER ////////////////////////
        /**
         * 
         * @param {*} user 'object': {id:'',name:'',...}
         * @param {*} type 'String': all, create, update, delete.
         * all --> Devuelve todos los usuarios.
         * user --> Devuelve un usuario
         * create --> crea datos para un nuevo usuario.
         * update --> actualiza un usuario.
         * delete --> elimina los datos de un usuario. 
         * 
         */
        function firebaseUser(user, type) {
            if (type == 'all') {
                FSP
                    .readAllUser()
                    .then(loaded => {
                        return loaded
                    }).catch(e => { return e });
            } else if (type == 'user') {
                FSP
                    .readUserData(user.id)
                    .then(loaded => { return loaded })
                    .catch(e => { return e });
            } else if (type == 'create') {
                FSP.createUserData(user)
            } else if (type == 'update') {
                FSP.updateUserData(user);
            } else if (type == 'delete') {
                FSP.deleteUserData(user.id);
            }
        }
        ////////////////////// INDEX ARRAY //////////////////////////
        /**
         * 
         * @param {*} object objecto que vamos a indexar en el array.
         * Si existe el objeto lo elimina del array.
         * Si no existe lo añade en el array.
         * @param {*} array0 
         * Array que vamos a indexar.
         * 
         */
        function indexArray(object, array0) {
            let array = array0;
            let idx = array.indexOf(object);
            if (idx == -1) array.push(object);
            else array.splice(idx, 1);
            return array;
        }
    }
})();