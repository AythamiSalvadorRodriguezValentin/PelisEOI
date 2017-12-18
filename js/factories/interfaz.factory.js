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
            let array = Object.assign(array0);
            if (typeof array == 'undefined') array = [];
            let idx = array.indexOf(object);
            if (idx == -1) array.push(object);
            else array.splice(idx, 1);
            return array;
        }
    }
})();