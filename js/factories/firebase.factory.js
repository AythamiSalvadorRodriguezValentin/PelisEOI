(function () {
    'use strict';
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .factory('FirebaseServiceProvider', FirebaseServiceProvider);
    ////////////////////////////////////////////////////////////
    FirebaseServiceProvider.$inject = [];
    function FirebaseServiceProvider() {
        let vm = this;
        var service = {
            readAllUser: readAllUser,
            readUserData: readUserData,
            createUserData: createUserData,
            updateUserData: updateUserData,
            deleteUserData: deleteUserData,
            createUserWithEmailAndPasswordUser: createUserWithEmailAndPasswordUser,
            signInWithEmailAndPasswordUser: signInWithEmailAndPasswordUser,
            onAuthStateChangedUser: onAuthStateChangedUser,
            currentUser: currentUser,
            updateUser: updateUser,
            updateEmailUser: updateEmailUser,
            getASecureRandomPasswordUser: getASecureRandomPasswordUser,
            sendPasswordResetEmail: sendPasswordResetEmail,
            deleteUser: deleteUser,
            reauthenticateWithCredentialUser: reauthenticateWithCredentialUser,
            signOutUser: signOutUser
        };
        return service;
        function readAllUser() {
            let promise = new Promise(function (resolve, reject) {
                firebase.database().ref('users').on('value', (u) => {
                    let users = Object.keys(u.val()).map((val, index) => { return u.val()[val]; });
                    resolve(users);
                });
            });
            return promise;
        }
        ///////////////////////////// Leer datos database ///////////////////////////////
        function readUserData(id) {
            let promise = new Promise(function (resolve, reject) {
                firebase.database().ref('users/' + id).on('value', function (u) {
                    let user = u.val();
                    resolve(u.val());
                });
            });
            return promise;
        }
        ///////////////////////////// Escribir datos database ///////////////////////////////
        function createUserData(user) {
            let promise = new Promise((resolve, reject) => {
                user.id = randId();
                firebase.database().ref('users/' + user.id).set({
                    id: (user.id) ? user.id : 'desconocido',
                    name: (user.name) ? user.name : 'null',
                    email: (user.email) ? user.email : 'null',
                    phone: (user.phone) ? user.phone : 'null',
                    photo: (user.photo) ? user.photo : 'null',
                    fav: (user.fav) ? user.fav : [],
                    see: (user.see) ? user.see : [],
                    saw: (user.saw) ? user.saw : [],
                }).catch(e => reject(e));
            })
            return promise;
        };
        ///////////////////////////// Actualiza datos database ///////////////////////////////
        function updateUserData(user) {
            firebase.database().ref('users/' + user.id).update({
                name: (user.name) ? user.name : 'null',
                email: (user.email) ? user.email : 'null',
                phone: (user.phone) ? user.phone : 'null',
                photo: (user.photo) ? user.photo : 'null',
                fav: (user.fav) ? user.fav : [],
                see: (user.see) ? user.see : [],
                saw: (user.saw) ? user.saw : [],
            });
        };
        ///////////////////////////// Elimina datos database ///////////////////////////////
        function deleteUserData(id) {
            firebase.database().ref('users/' + id).delete({
                /* name: user.name,
                email: user.email,
                phone : user.phone,
                photo: user.photo */
            });
        };
        ///////////////////////////// Registra usuarios nuevos ///////////////////////////////
        function createUserWithEmailAndPasswordUser(email, password) {
            let promise = new Promise((resolve, reject) => {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(loaded => resolve('created'))
                    .catch(e => reject(e));
            });
            return promise;
        };
        ///////////////////////////// Acceso de usuarios existentes ///////////////////////////////
        function signInWithEmailAndPasswordUser(email, password) {
            let promise = new Promise((resolve, reject) => {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(loaded => resolve(loaded))
                    .catch(e => reject(e));
            });
            return promise;
        }
        ///////////////////////////// Obtén el usuario con sesión activa ///////////////////////////////
        function onAuthStateChangedUser() {
            let promise = new Promise(function (resolve, reject) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        // User is signed in. // Obtén el perfil de un usuario //
                        var displayName = user.displayName;
                        var email = user.email;
                        var emailVerified = user.emailVerified;
                        var photoURL = user.photoURL;
                        var isAnonymous = user.isAnonymous;
                        var uid = user.uid;
                        var providerData = user.providerData;
                        resolve(user);
                    } else reject(null);
                });
            });
            return promise;
        };
        ////////////////////////////// Obtén el perfil de un usuario //////////////////////////////
        function currentUser() {
            let promise = new Promise((resolve, reject) => {
                let user = firebase.auth().currentUser;
                if (user != null) resolve(user);
                else reject(null);
            });
            return promise;
        };
        ///////////////////////////// Actualiza el perfil de un usuario ///////////////////////////////
        function updateUser(user) {
            let promise = new Promise((resolve, reject) => {
                firebase
                    .auth().currentUser
                    .updateProfile({
                        displayName: user.name,
                        photoURL: user.photo,
                        /* phoneNumber: user.phone, */
                    }).then(loaded => resolve('update correct'))
                    .catch(e => reject(e))
            });
            return promise;
        };
        /////////////////////////////// Configura la dirección de correo electrónico de un usuario /////////////////////////////
        function updateEmailUser(user) {
            let userFire = firebase.auth().currentUser;
            userFire.updateEmail(user.email).then(function () {
                // Update successful.
            }).catch(function (error) {
                // An error happened.
            });
        }
        //////////////////////////// Configura la contraseña de un usuario ////////////////////////////////
        function getASecureRandomPasswordUser() {
            let user = firebase.auth().currentUser;
            let newPassword = getASecureRandomPassword();
            user.updatePassword(newPassword).then(function () {
                // Update successful.
            }).catch(function (error) {
                // An error happened.
            });
        }
        ///////////////////////////// Envía un correo electrónico de restablecimiento de la contraseña ///////////////////////////////
        function sendPasswordResetEmail() {
            let auth = firebase.auth();
            let emailAddress = "user@example.com";
            auth.sendPasswordResetEmail(emailAddress).then(function () {
                // Email sent.
            }).catch(function (error) {
                // An error happened.
            });
        }
        /////////////////////////// Borra un usuario /////////////////////////////////
        function deleteUser() {
            let user = firebase.auth().currentUser;
            user.delete().then(function () {
                // User deleted.
            }).catch(function (error) {
                // An error happened.
            });
        };
        /////////////////////////// Vuelve a autenticar un usuario /////////////////////////////////
        function reauthenticateWithCredentialUser() {
            let user = firebase.auth().currentUser;
            let credential;
            // Prompt the user to re-provide their sign-in credentials
            user.reauthenticateWithCredential(credential).then(function () {
                // User re-authenticated.
            }).catch(function (error) {
                // An error happened.
            });
        }
        ///////////////////////////// Desconectar Usuario ///////////////////////////////
        function signOutUser() {
            let promise = new Promise((resolve, reject) => {
                firebase
                    .auth()
                    .signOut()
                    .then(loaded => resolve('user disconnected'))
                    .catch(e => reject(e));
            });
            return promise;
        }
        /////////////////////////////////////////// OTHER FUCTION /////////////////////////////////////////
        function randId() {
            return Math.random().toString(36).substr(2, 10);
        }
        ////////////////////////////////////////////////////////////
    }
})();