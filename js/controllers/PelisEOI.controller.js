(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('PelisEOIController', PelisEOIController);

    PelisEOIController.$inject = ['InterfazServerFactory'];
    function PelisEOIController(InterSF) {
        let vm = this;
        ///////////////////////// VAR VM //////////////////////////
        vm.genreList = []; vm.navList = []; vm.films = []; vm.users = []; vm.orderBy = [];
        vm.user = {}; vm.film = {}; vm.search = {}; vm.slider = {}; vm.timeout = {};
        vm.load = false; vm.viewFilm = false; vm.warning = false; vm.formUser = true;
        vm.view = ''; vm.errorBox = '';
        /////////////////////// FUCTION VM ////////////////////////
        vm.changeView = changeView;
        vm.checkView = checkView;
        vm.getMovies = getMovies;
        vm.changeFilter = changeFilter;
        vm.resetFilter = resetFilter;
        vm.selectGenre = selectGenre;
        vm.checkGenreButton = checkGenreButton;
        vm.fuctionFavourite = fuctionFavourite;
        vm.fuctionSeeLater = fuctionSeeLater;
        vm.fuctionSawLast = fuctionSawLast;
        vm.showFilm = showFilm;
        vm.errorDisplay = errorDisplay;
        vm.pushRegistrer = pushRegistrer;
        vm.fuctionUser = fuctionUser;
        vm.signUser = signUser;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.user = { auth: false, sign: true, data: null, database: null }
            vm.navList = ['Descubrir', 'Próximamente', 'Mis favoritas', 'Para más tarde', 'Vistas'];
            vm.search = { title: '', year: '', type: '', language: '', sort_by: '', genre: [], page: 1 };
            vm.orderBy = InterSF.getOrderDataBy();
            fuctionGenres(vm.search, 'genres');
            fuctionUser('all');
        };
        /////////////////////// FUCTION $VIEW /////////////////////////
        function changeView(nav) {
            vm.view = nav;
            if (nav == vm.navList[0]) {
                resetFilter('popular');
            } else if (nav == vm.navList[1]) {
                resetFilter('upcoming');
            } else if (nav == vm.navList[2]) {
                vm.films.data = vm.user.favorite;
                vm.films.total = vm.user.favorite.length;
            } else if (nav == vm.navList[3]) {
                vm.films.data = vm.user.seeLater;
                vm.films.total = vm.user.seeLater.length;
            } else if (nav == vm.navList[4]) {
                vm.films.data = vm.user.sawLast;
                vm.films.total = vm.user.sawLast.length;
            } else vm.films = {};
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
                    vm.search.page = 1;
                    vm.films = [];
                }
                vm.load = true;
                fuctionMovie(vm.search, (vm.search.title.length > 0) ? 'search' : 'popular');
            }, 300);
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
        };
        function resetFilter(type) {
            /* Search */
            vm.search.page = 1;
            vm.search.title = '';
            vm.search.genre = [];
            vm.search.language = 'es-ES';
            vm.search.order = vm.orderBy[1].name;
            /* Slider */
            vm.slider.minYear = 1950;
            vm.slider.minYearValue = 1980;
            vm.slider.maxYear = 2050;
            vm.slider.maxYearValue = 2020;
            /* Popular */
            fuctionMovie(vm.search, type);
        };
        /////////////////////// FUCTION GENRE /////////////////////////
        function selectGenre(genre) {
            vm.search.genre = InterSF.indexArray(genre, vm.search.genre);
            changeFilter();
        };
        function checkGenreButton(genre) {
            return (vm.search.genre.indexOf(genre) != -1) ? true : false;
        };
        ///////////////////// FUCTION FAVOURITE ///////////////////////
        function fuctionFavourite(object, type) {
            if (!vm.user.auth) return;
            if (type == 'class') {
                return (vm.user.favourite.indexOf(fav) != -1) ? true : false;
            } else if (type == 'click') {
                vm.user.favourite = InterSF.indexArray(object, vm.user.favourite);
                InterSF.firebaseUser(vm.user, 'update');
            }
        };
        ///////////////////// FUCTION SEE LATER ///////////////////////
        function fuctionSeeLater(object, type) {
            if (!vm.user.auth) return;
            if (type == 'class') {
                return (vm.user.seeLater.indexOf(see) != -1) ? true : false;
            } else if (type == 'click') {
                vm.user.seeLater = InterSF.indexArray(object, vm.user.seeLater);
                InterSF.firebaseUser(vm.user, 'update');
            }
        };
        ///////////////////// FUCTION SAW LAST ////////////////////////
        function fuctionSawLast(object, type) {
            if (!vm.user.auth) return;
            if (type == 'class') {
                return (vm.user.sawLast.indexOf(saw) != -1) ? true : false;
            } else if (type == 'click') {
                vm.user.sawLast = InterSF.indexArray(object, vm.user.sawLast);
                InterSF.firebaseUser(vm.user, 'update');
            }
        };
        ///////////////////// FUCTION SHOW VIEW ///////////////////////
        function showFilm(film) {
            if (vm.viewFilm) { vm.film = {}; vm.viewFilm = false; return; }
            film.page = 1;
            film.externalID = 'imdb_id';
            film.language = vm.search.language;
            fuctionFullMovie(film);
        };
        ///////////////////////// ERROR ///////////////////////////////
        function errorDisplay(e) {
            vm.errorBox = e;
            vm.warning = true;
            clearTimeout(vm.timeout.show);
            vm.timeout.error = setTimeout(() => {
                vm.warning = false;
            }, 1000);
        }
        ////////////////////// OTHER FUCTION //////////////////////////
        function fuctionGenres(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.genreList = loaded;
                }).catch(e => errorDisplay(e));
        };
        function fuctionMovie(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.films = loaded;
                    vm.load = false;
                }).catch(e => errorDisplay(e));
        };
        function fuctionFullMovie(object) {
            InterSF
                .getMovieDataFull(object)
                .then(loaded => {
                    vm.film = loaded;
                    vm.viewFilm = true;
                }).catch(e => errorDisplay(e));
        };
        //////////////////////// FUCTION USER /////////////////////////
        function pushRegistrer() {
            vm.user.sign = false;
            errorDisplay('Rellena el formulario para registrarte');
        };
        function fuctionUser(type) {
            if (type == 'all') {
                InterSF
                    .firebaseUser(vm.user, 'all')
                    .then(loaded => vm.users = loaded)
                    .catch(e => errorDisplay(e));
            } else if (type == 'user') {
                let user = {}; let isIn = false;
                for (let i = 0; i < vm.users.length; i++) { 
                    if (vm.users[i].email == vm.user.data.email) { user = vm.users[i]; isIn = true; } 
                }
                if (isIn) {
                    InterSF
                        .firebaseUser(user, 'user')
                        .then(loaded => vm.user.database = loaded)
                        .catch(e => errorDisplay(e));
                }
            } else if (type == 'create') {
                InterSF
                    .firebaseUser(vm.user.create, 'create')
                    .then(loaded => loaded)
                    .catch(e => errorDisplay(e));
            } else if (type == 'update') {

            } else if (type == 'delete') {

            }
        };
        //////////////////////// FUCTION SIGN /////////////////////////
        function signUser(type) {
            if (type == 'create') {
                InterSF
                    .firebaseSign(vm.user.create, type)
                    .then(loaded => {
                        vm.user.auth = false;
                        vm.user.sign = true;
                        fuctionUser('create');
                        signUser('update');
                        errorDisplay('Inicia Sesion');
                    }).catch(e => errorDisplay(e));
            } else if (type == 'up') {
                InterSF
                    .firebaseSign(vm.user.login, type)
                    .then(loaded => signUser('current'))
                    .catch(e => {
                        vm.user.login = {};
                        errorDisplay(e.message);
                    });
            } else if (type == 'out') {
                if (vm.user.auth) {
                    InterSF
                        .firebaseSign(vm.user, type)
                        .then(loaded => {
                            vm.user.data = null;
                            vm.user.auth = false;
                        }).catch(e => errorDisplay(e))
                }
            } else if (type == 'update') {
                InterSF
                    .firebaseSign(vm.user.create, 'update')
                    .then(loaded => {
                        vm.user.create = {}
                    }).catch(e => errorDisplay(e));
            } else if (type == 'current') {
                InterSF
                    .firebaseSign(vm.user, type)
                    .then(loaded => {
                        vm.user.login = {};
                        if (loaded != null) {
                            vm.user.data = loaded;
                            vm.user.auth = true;
                            fuctionUser('user');
                            changeView(vm.navList[0]);
                        } else {
                            vm.user.auth = false;
                            vm.user.sign = true;
                            vm.user.data = null;
                            vm.user.database = null;
                            errorDisplay('No estas conectado');
                        }
                    }).catch(e => errorDisplay(e));
            }
        };
    }
})();