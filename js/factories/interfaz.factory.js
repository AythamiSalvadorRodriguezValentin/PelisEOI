(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('InterfazServerFactory', InterfazServerFactory);

    InterfazServerFactory.$inject = ['TheMovieDBServerProvider', 'OmdbIDServerProvider', 'FirebaseServiceProvider'];
    function InterfazServerFactory(TMDBSP, OIDSP, FSP) {
        let vm = this;
        vm.data = {};
        ////////////////////////////////////////////////////////////
        var service = {
            getMoviesData: getMoviesData,
            getMovieDataFull: getMovieDataFull,
            getOrderDataBy: getOrderDataBy,
            firebaseSign: firebaseSign,
            firebaseUser: firebaseUser,
            addRemoveObjectArray: addRemoveObjectArray,
            addObjectArray: addObjectArray,
            indexIDArray: indexIDArray
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
            let p1 = new Promise(function (resolve, reject) {
                vm.data = {};
                TMDBSP
                    .getMovieFull(object)
                    .then(loaded => {
                        vm.data = loaded;
                        OIDSP
                            .getMovieID(vm.data.imdb_id)
                            .then(loaded => {
                                resolve(loaded);
                            }).catch(e => reject(e));
                    }).catch(e => reject(e));
            });
            return p1
                .then(loaded => {
                    vm.data.ombdID = loaded;
                    return vm.data;
                }).catch(e => { return e; });
        }
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
            let promise = new Promise((resolve, reject) => {
                switch (type) {
                    case 'create':
                        FSP
                            .createUserWithEmailAndPasswordUser(user)
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'up':
                        FSP
                            .signInWithEmailAndPasswordUser(user)
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'out':
                        FSP
                            .signOutUser()
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'update':
                        FSP
                            .updateUser(user)
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'current':
                        FSP
                            .onAuthStateChangedUser()
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'now':
                        FSP
                            .currentUser()
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    default:
                        break;
                }
            });
            return promise;
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
            let promise = new Promise((resolve, reject) => {
                switch (type) {
                    case 'all':
                        FSP
                            .readAllUser()
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'user':
                        FSP
                            .readUserData(user.id)
                            .then(loaded => resolve(loaded))
                            .catch(e => reject(e));
                        break;
                    case 'create':
                        FSP.createUserData(user)
                            .catch(e => reject(e));
                        break;
                    case 'update':
                        FSP.updateUserData(user);
                        break;
                    case 'delete':
                        FSP.deleteUserData(user.id);
                        break;
                    default:
                        break;
                }
            });
            return promise;
        };
        ////////// ADD OR REMOVE OBJECT ARRAY //////////////
        /**
         * 
         * @param {*} array 
         * Array que vamos a indexar.
         * 
         * @param {*} object 
         * Objecto que vamos a indexar en el array.
         * Si existe el objeto lo elimina del array.
         * Si no existe lo añade en el array.
         * 
         */
        function addRemoveObjectArray(array, object) {
            if (typeof array == 'undefined') array = [];
            let a = Object.assign(array);
            let isIn = false;
            for (let i = 0; i < a.length; i++) {
                if (a[i].id == object.id) {
                    a.splice(i, 1);
                    isIn = true;
                }
            }
            if (!isIn) a.push(object);
            return a;
        };
        //////////////// ADD OBJECT ARRAY ///////////////////
        /**
         * 
         * @param {*} array 
         * Array que vamos a indexar.
         * 
         * @param {*} object 
         * Objecto que vamos a indexar en el array.
         * Si existe el objeto lo elimina del array.
         * Si no existe lo añade en el array.
         * 
         */
        function addObjectArray(array, object) {
            if (typeof array == 'undefined') array = [];
            let a = Object.assign(array);
            let isIn = false;
            for (let i = 0; i < a.length; i++) {
                if (a[i].id == object.id) isIn = true;
            }
            if (!isIn) a.push(object);
            return a;
        };
        /////////////////////// INDEX ID ARRAY //////////////////////
        /**
         * 
         * @param {*} array 
         * Array que vamos a indexar.
         * 
         * @param {*} object 
         * Objecto que vamos a indexar en el array.
         * Devuelve verdadero si se encuentra en el array.
         * 
         */
        function indexIDArray(array, object) {
            if (typeof array == 'undefined') array = [];
            let a = Object.assign(array);
            for (let i = 0; i < a.length; i++) {
                if (a[i].id == object.id) return true;
            }
            return false;
        };
    }
})();