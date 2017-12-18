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
        vm.fuctionFavourite = fuctionFavourite;
        vm.fuctionSeeLater = fuctionSeeLater;
        vm.fuctionSawLast = fuctionSawLast;
        vm.showFilm = showFilm;
        vm.messageDisplay = messageDisplay;
        vm.pushRegistrer = pushRegistrer;
        vm.signOutUser = signOutUser;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.search = { title: '', year: '', type: '', language: 'es-ES', sort_by: '', genre: [], page: 1 };
            vm.navList = ['Descubrir', 'Próximamente', 'Mis favoritas', 'Para más tarde', 'Vistas'];
            vm.user = { auth: true, sign: true, data: null, database: null }
            vm.orderBy = InterSF.getOrderDataBy();
            fuctionGenres(vm.search, 'genres');
            changeView(vm.navList[0]);
        };
        /////////////////////// FUCTION $VIEW /////////////////////////
        function changeView(nav) {
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
                    vm.films.data = vm.user.favorite;
                    break;
                case vm.navList[3]:
                    vm.films.data = vm.user.seeLater;
                    break;
                case vm.navList[4]:
                    vm.films.data = vm.user.sawLast;
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
                    vm.search.page = 1;
                    vm.films = [];
                }
                vm.load = true;
                resetFilter();
                fuctionMovie(vm.search, (vm.search.title.length > 0) ? 'search' : 'popular');
            }, 300);
        };
        /////////////////////// FUCTION GENRE /////////////////////////
        function selectGenre(genre) {
            vm.search.genre = InterSF.indexArray(genre, vm.search.genre);
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
            vm.slider.minYearValue = 1980;
            vm.slider.maxYear = 2050;
            vm.slider.maxYearValue = 2020;
            setTimeout(() => { 
                vm.slider.minYear = 1980;
                vm.slider.minYearValue = 1960;
                vm.slider.maxYear = 2030;
                vm.slider.maxYearValue = 2010; 
            }, 2000)
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
                    }).catch(e => messageDisplay(e))
            }
        };
        ////////////////////// OTHER FUCTION //////////////////////////
        function fuctionGenres(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.genreList = loaded;
                }).catch(e => messageDisplay(e));
        };
        function fuctionMovie(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.films = loaded;
                    vm.load = false;
                }).catch(e => messageDisplay(e));
        };
        function fuctionFullMovie(object) {
            InterSF
                .getMovieDataFull(object)
                .then(loaded => {
                    vm.film = {};
                    vm.film = loaded;
                    $scope.$apply(vm.viewFilm = true);
                }).catch(e => messageDisplay(e));
        };
    }
})();