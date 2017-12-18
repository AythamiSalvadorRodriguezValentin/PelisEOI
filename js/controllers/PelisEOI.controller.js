(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['$scope', 'InterfazServerFactory'];
    function PelisEOIController($scope, InterSF) {
        let vm = this;
        ///////////////////////// VAR VM //////////////////////////
        vm.genreList = [];
        vm.navList = [];
        vm.films = [];
        vm.users = [];
        vm.orderBy = [];
        vm.user = {};
        vm.film = {};
        vm.search = {};
        vm.slider = {};
        vm.timeout = {};
        vm.load = false;
        vm.viewFilm = false;
        vm.viewMessage = false;
        vm.formUser = true;
        vm.messageType = false;
        vm.view = '';
        vm.message = '';
        /////////////////////// FUCTION VM ////////////////////////
        vm.changeView = changeView;
        vm.checkView = checkView;
        vm.getMovies = getMovies;
        vm.changeFilter = changeFilter;
        vm.resetFilter = resetFilter;
        vm.selectGenre = selectGenre;
        vm.checkGenreButton = checkGenreButton;
        vm.elementsUser = elementsUser;
        vm.messageDisplay = messageDisplay;
        vm.pushRegistrer = pushRegistrer;
        vm.signOutUser = signOutUser;
        vm.showFilm = showFilm;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.search = { title: '', year: '', type: '', language: 'es-ES', sort_by: '', genre: [], page: 1 };
            vm.navList = ['Descubrir', 'Próximamente', 'Mis favoritas', 'Para más tarde', 'Vistas'];
            vm.user = { auth: false, sign: true, data: null, database: null }
            vm.orderBy = InterSF.getOrderDataBy();
            fuctionGenres(vm.search, 'genres');
        };
        /////////////////////// FUCTION $VIEW /////////////////////////
        function changeView(nav) {
            vm.films.total = 0;
            resetFilter();
            vm.view = nav;
            switch (nav) {
                case vm.navList[0]:
                    fuctionMovie(vm.search, 'popular');
                    break;
                case vm.navList[1]:
                    fuctionMovie(vm.search, 'upcoming');
                    break;
                case vm.navList[2]:
                    vm.films.data = (vm.user.database) ? vm.user.database.fav : [];
                    break;
                case vm.navList[3]:
                    vm.films.data = (vm.user.database) ? vm.user.database.see : [];
                    break;
                case vm.navList[4]:
                    vm.films.data = (vm.user.database) ? vm.user.database.saw : [];
                    break;
                default:
                    break;
            }
        }
        function checkView(nav) {
            return (vm.view == nav) ? true : false;
        }
        /////////////////////// FUCTION $FILM /////////////////////////
        function getMovies(str) {
            clearTimeout(vm.timeout.search);
            vm.timeout.search = setTimeout(function () {
                if (str === 'Y') vm.search.page++;
                else {
                    resetFilter();
                    vm.search.page = 1;
                    vm.films = [];
                }
                vm.load = true;
                fuctionMovie(vm.search, (vm.search.title.length > 0) ? 'search' : 'popular');
            }, 300);
        };
        /////////////////////// FUCTION GENRE /////////////////////////
        function selectGenre(genre) {
            vm.search.genre = InterSF.addRemoveObjectArray(vm.search.genre, genre);
            changeFilter();
        };
        function checkGenreButton(genre) {
            return (vm.search.genre.indexOf(genre) != -1) ? true : false;
        };
        /////////////////////// FUCTION FILTER ////////////////////////
        function changeFilter() {
            clearTimeout(vm.timeout.filter);
            vm.timeout.filter = setTimeout(getMovieFilter, 300);
        };
        function getMovieFilter() {
            Object.keys(vm.orderBy).map(function (val, i) {
                if (vm.orderBy[val].name == vm.search.order) vm.search.sort_by = vm.orderBy[i].trans;
            });
            vm.search.release_date_gte = vm.slider.minYearValue + '-01-01';
            vm.search.release_date_lte = vm.slider.maxYearValue + '-12-31';
            fuctionMovie(vm.search, 'discover');
            vm.search.title = '';
        };
        function resetFilter() {
            /* Search */
            vm.search.page = 1;
            vm.search.genre = [];
            vm.search.order = vm.orderBy[1].name;
            /* Slider */
            vm.slider.minYear = 1950;
            vm.slider.minYearValue = 1970;
            vm.slider.maxYear = 2050;
            vm.slider.maxYearValue = 2020;
        };
        //////////////// FUCTION ELEMENTS USER ///////////////////////
        function elementsUser(object, type, clase) {
            if (!vm.user.auth || vm.user.database == null) return;
            if (clase == 'class') {
                return (InterSF.indexIDArray(vm.user.database[type], object)) ? true : false;
            }
            else if (clase == 'click') {
                vm.user.database[type] = InterSF.addRemoveIDArray(vm.user.database[type], object);
                InterSF.firebaseUser(vm.user.database, 'update');
            }
        };
        function filmsSaw(object) {
            if (!vm.user.auth || vm.user.database == null) return;
            vm.user.database.saw = InterSF.addIDArray(vm.user.database.saw, object);
            InterSF.firebaseUser(vm.user.database, 'update');
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
        //////////////////////// FUCTION SIGN /////////////////////////
        function signOutUser() {
            if (vm.user.auth) {
                InterSF
                    .firebaseSign(vm.user, 'out')
                    .then(loaded => {
                        vm.user.data = null;
                        vm.user.auth = false;
                        $scope.$apply();
                    }).catch(e => messageDisplay(e, 'error'))
            }
        };
        ///////////////////// FUCTION SHOW VIEW ///////////////////////
        function showFilm(film) {
            if (vm.viewFilm) { vm.film = {}; vm.viewFilm = false; return; }
            film.page = 1;
            film.externalID = 'imdb_id';
            film.language = vm.search.language;
            filmsSaw(film);
            fuctionFullMovie(film);
        };
        ////////////////////// OTHER FUCTION //////////////////////////
        function fuctionGenres(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.genreList = loaded;
                }).catch(e => messageDisplay(e, 'error'));
        };
        function fuctionMovie(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.films = loaded;
                    vm.load = false;
                }).catch(e => messageDisplay(e, 'error'));
        };
        function fuctionFullMovie(object) {
            InterSF
                .getMovieDataFull(object)
                .then(loaded => {
                    vm.film = {};
                    vm.film = loaded;
                    $scope.$apply(vm.viewFilm = true);
                }).catch(e => messageDisplay(e, 'error'));
        };
    }
})();