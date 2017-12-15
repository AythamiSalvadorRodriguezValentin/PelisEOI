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
                firebase.database().ref('users').on('value', function (u) {
                    let users = Object.keys(u.val()).map(function (val) {
                        return u.val()[val];
                    });
                    console.log(users);
                    /* resolve(u.val()); */
                });
            });
            return promise;
        }
        ///////////////////////////// Leer datos database ///////////////////////////////
        function readUserData(id) {
            let promise = new Promise(function (resolve, reject) {
                firebase.database().ref('users/' + id).on('value', function (u) {
                    resolve(u.val());
                });
            });
            return promise;
        }
        ///////////////////////////// Escribir datos database ///////////////////////////////
        function createUserData(user) {
            user.id = randId();
            firebase.database().ref('users/' + user.id).set({
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo
            });
        };
        ///////////////////////////// Actualiza datos database ///////////////////////////////
        function updateUserData(user) {
            firebase.database().ref('users/' + user.id).update({
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo
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
        function createUserWithEmailAndPasswordUser(user) {
            return firebase
                .auth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then(loaded => { return loaded; })
                .catch(e => { return e; });
        };
        ///////////////////////////// Acceso de usuarios existentes ///////////////////////////////
        function signInWithEmailAndPasswordUser(user) {
            return firebase
                .auth()
                .signInWithEmailAndPassword(user.email, user.password)
                .then(loaded => { return loaded; })
                .catch(e => { return e; });
        }
        ///////////////////////////// Obtén el usuario con sesión activa ///////////////////////////////
        function onAuthStateChangedUser() {
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
                    // ...
                } else {
                    // User is signed out.
                    // ...
                }
            });
        };
        ////////////////////////////// Obtén el perfil de un usuario //////////////////////////////
        function currentUser() {
            let user = firebase.auth().currentUser;
            if (user != null) { return user; }
            else { return user; }
        };
        ///////////////////////////// Actualiza el perfil de un usuario ///////////////////////////////
        function updateUser(user) {
            return firebase
                .auth().currentUser
                .updateProfile({
                    displayName: user.name,
                    photoURL: user.photo,
                }).then(loaded => { return 'update correct' })
                .catch(e => { return e; });
        };
        /////////////////////////////// Configura la dirección de correo electrónico de un usuario /////////////////////////////
        function updateEmailUser(user) {
            let user = firebase.auth().currentUser;
            user.updateEmail(user.email).then(function () {
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
            return firebase
                .auth()
                .signOut()
                .then(loaded => { return 'user disconnected'; })
                .catch(e => { return e; });
        }
        /////////////////////////////////////////// OTHER FUCTION /////////////////////////////////////////
        function randId() {
            return Math.random().toString(36).substr(2, 10);
        }
        ////////////////////////////////////////////////////////////
    }
})();