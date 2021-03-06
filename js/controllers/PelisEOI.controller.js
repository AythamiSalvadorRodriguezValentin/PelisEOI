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
        vm.view = {};
        vm.load = false;
        vm.formUser = true;
        vm.message = {};
        /////////////////////// FUCTION VM ////////////////////////
        vm.menu = menu;
        vm.changeView = changeView;
        vm.checkView = checkView;
        vm.getMovies = getMovies;
        vm.changeSliderYear = changeSliderYear;
        vm.changeFilter = changeFilter;
        vm.resetFilter = resetFilter;
        vm.selectGenre = selectGenre;
        vm.checkGenreButton = checkGenreButton;
        vm.elementsUser = elementsUser;
        vm.messageDisplay = messageDisplay;
        vm.pushRegistrer = pushRegistrer;
        vm.iconUserClick = iconUserClick;
        vm.showFilm = showFilm;
        vm.menuClick = menuClick;
        vm.showHideBarLeft = showHideBarLeft;
        vm.scrollPagePrincipal = scrollPagePrincipal;
        vm.moveScroll = moveScroll;
        /////////////////////////// INIT //////////////////////////////
        activate();
        /////////////////////// FUCTION $INIT /////////////////////////
        function activate() {
            vm.search = { title: '', year: '', type: '', language: 'es-ES', order: '', sort_by: '', genre: [], page: 1, resetFilter: false };
            vm.user = { anonimo: false, auth: false, register: false, sign: false, data: null, database: null };
            vm.navList = ['Descubrir', 'Próximamente', 'Mis favoritas', 'Para más tarde', 'Vistas'];
            vm.view = { view: vm.navList[0], film: false, barLeft: false, message: false, menu: { menu: false, filter: false } };
            if ($('html')[0].clientWidth > 992) vm.view.barLeft = true;
            vm.message.errormssg = 'Ups, ha habido un error :)';
            vm.orderBy = InterSF.getOrderDataBy();
            fuctionGenres(vm.search, 'genres');
            $(window).resize(onsizeScreen);
            configAnimatedJQuery();
            resetFilter(true);
            lazyLoad(true);
            arrowUp(true);
            currentUser();
            teclado(true);
        };
        /////////////////////// FUCTION $MENU /////////////////////////
        function menu(object) {
            vm.view.menu.menu = false, vm.view.menu.search = false, vm.view.menu.filter = false;
            if (object == 'init') vm.view.menu.logo = true;
            else if (object == 'search') vm.view.menu.search = true;
            else if (object == 'filter') vm.view.menu.filter = true;
        }
        /////////////////////// FUCTION $VIEW /////////////////////////
        function changeView(nav) {
            vm.view.menu.menu = false, vm.view.menu.search = false, vm.view.menu.filter = false;
            if (vm.view.view == nav) return;
            vm.view.view = nav;
            showHideBarLeft(nav);
            resetFilter(false);
            vm.films = [];
            switch (nav) {
                case vm.navList[0]:
                    fuctionMovie(vm.search, 'popular', true);
                    break;
                case vm.navList[1]:
                    fuctionMovie(vm.search, 'upcoming', true);
                    break;
                case vm.navList[2]:
                    animate('container-films', 'fadeIn');
                    vm.films.data = (vm.user.database) ? vm.user.database.fav : [];
                    break;
                case vm.navList[3]:
                    animate('container-films', 'fadeIn');
                    vm.films.data = (vm.user.database) ? vm.user.database.see : [];
                    break;
                case vm.navList[4]:
                    animate('container-films', 'fadeIn');
                    vm.films.data = (vm.user.database) ? vm.user.database.saw : [];
                    break;
                default:
                    break;
            }
        }
        function checkView(nav) {
            if (vm.view.menu.search || vm.view.menu.filter) return false;
            return (vm.view.view == nav) ? true : false;
        };
        /////////////////////// FUCTION $FILM /////////////////////////
        function getMovies() {
            showHideBarLeft(vm.view.view);
            clearTimeout(vm.timeout.search);
            vm.timeout.search = setTimeout(searchMovies, 350);
        };
        function searchMovies(more) {
            vm.load = true;
            if (more === 'Y') vm.search.page++;
            else { vm.films = []; vm.search.page = 1; resetFilter(false); }
            if (vm.search.title.length > 0) vm.view.view = vm.navList[0];
            fuctionMovie(vm.search, (vm.search.title.length > 0) ? 'search' : 'popular', (more != 'Y') ? true : false);
        }
        /////////////////////// FUCTION GENRE /////////////////////////
        function selectGenre(genre) {
            vm.search.genre = InterSF.addRemoveObjectArray(vm.search.genre, genre);
            changeFilter();
        };
        function checkGenreButton(genre) {
            return (vm.search.genre.indexOf(genre) != -1) ? true : false;
        };
        /////////////////////// FUCTION SLIDER ////////////////////////
        function changeSliderYear(min, max) {
            if (typeof min != 'undefined') vm.slider.minYearValue = min;
            if (typeof max != 'undefined') vm.slider.maxYearValue = max;
            changeFilter();
        }
        /////////////////////// FUCTION FILTER ////////////////////////
        function changeFilter() {
            clearTimeout(vm.timeout.filter);
            vm.timeout.filter = setTimeout(getMovieFilter, 350);
        };
        function getMovieFilter(more) {
            if (more == 'Y') vm.search.page++;
            else { vm.films = []; vm.search.page = 1; }
            vm.search.resetFilter = false;
            vm.search.release_date_gte = vm.slider.minYearValue + '-01-01';
            vm.search.release_date_lte = vm.slider.maxYearValue + '-12-31';
            Object.keys(vm.orderBy).map(function (val, i) {
                if (vm.orderBy[val].name == vm.search.order) vm.search.sort_by = vm.orderBy[i].trans;
            });
            fuctionMovie(vm.search, 'discover', (more != 'Y') ? true : false);
            vm.search.title = '';
        };
        function resetFilter(popular) {
            vm.search.page = 1;
            vm.search.genre = [];
            vm.search.order = vm.orderBy[1].name;
            vm.slider.minYear = 1950;
            vm.slider.maxYear = 2020;
            vm.slider.minYearValue = 1980;
            vm.slider.maxYearValue = 2018;
            if (vm.search.resetFilter) return;
            else vm.search.resetFilter = true;
            if (popular) { vm.films = []; fuctionMovie(vm.search, 'popular', true); }
        };
        //////////////// FUCTION ELEMENTS USER ///////////////////////
        function elementsUser(object, type, clase) {
            if (vm.user.database == null) return;
            let newObject = { id: object.id, poster: object.poster };
            if (clase == 'class') return (InterSF.indexIDArray(vm.user.database[type], newObject)) ? true : false;
            else if (clase == 'click') {
                if (vm.view.view == vm.navList[2] || vm.view.view == vm.navList[3]) {
                    let question = prompt("¿Estas seguro que deseas eliminarlo de la lista? Introduce 'Y' o cancela");
                    if (question == 'Y') vm.user.database[type] = InterSF.addRemoveIDArray(vm.user.database[type], newObject);
                } else vm.user.database[type] = InterSF.addRemoveIDArray(vm.user.database[type], newObject);
                if (!vm.user.anonimo && vm.user.data != null) InterSF.firebaseUser(vm.user.database, 'update');
                if (vm.user.anonimo) InterSF.anonimoUserLocalStorage(vm.user.database, 'update');
            }
        };
        function filmsSaw(object) {
            if (vm.user.database == null) return;
            let newObject = { id: object.id, poster: object.poster };
            vm.user.database.saw = InterSF.addIDArray(vm.user.database.saw, newObject);
            if (!vm.user.anonimo && vm.user.data != null) InterSF.firebaseUser(vm.user.database, 'update');
            if (vm.user.anonimo) InterSF.anonimoUserLocalStorage(vm.user.database, 'update');
        }
        ///////////////////////// MESSAGE /////////////////////////////
        function messageDisplay(e, type) {
            vm.message.mssg = e;
            vm.view.message = true;
            clearTimeout(vm.timeout.show);
            vm.message.type = (type == 'error') ? false : true;
            vm.timeout.message = setTimeout(() => $scope.$apply(vm.view.message = false), 5000);
        };
        ////////////////////// FUCTION REGISTER ///////////////////////
        function pushRegistrer() {
            vm.user.sign = false;
            vm.user.register = true;
        };
        /////////////////// FUCTION CURRENT USER ////////////////////
        function currentUser() {
            setTimeout(() => {
                Promise.all
                    ([InterSF.firebaseUser(vm.user, 'all'),
                    InterSF.firebaseSign(vm.user, 'now')])
                    .then(loaded => {
                        vm.user.auth = true;
                        vm.user.anonimo = false;
                        vm.user.sign = false;
                        vm.user.register = false;
                        vm.users = loaded[0];
                        vm.user.data = loaded[1];
                        readUser();
                    })
                    .catch(e => {
                        vm.user.auth = false;
                        vm.user.data = null;
                        vm.user.anonimo = true;
                        vm.user.database = InterSF.anonimoUserLocalStorage(vm.user, 'get')
                        if (!vm.user.database) vm.user.database = { fav: [], see: [], saw: [] };
                    });
            }, 500);
        }
        //////////////////////// FUCTION USER ////////////////////////
        function readUser() {
            if (vm.users.length == 0) return;
            let isIn = false;
            for (let i = 0; i < vm.users.length; i++) {
                if (vm.users[i].email == vm.user.data.email) {
                    vm.user.database = vm.users[i];
                    isIn = true;
                }
            } if (!isIn) $scope.$apply(messageDisplay(vm.message.errormssg, 'error'));
            else $scope.$apply(messageDisplay('¡Bienvenido ' + vm.user.data.displayName + '!'));
        };
        function iconUserClick() {
            if (vm.user.auth) {
                InterSF
                    .firebaseSign(vm.user, 'out')
                    .then(loaded => {
                        vm.user.auth = false;
                        vm.user.anonimo = true;
                        vm.user.database = InterSF.anonimoUserLocalStorage(vm.user, 'get');
                        if (!vm.user.database) vm.user.database = { fav: [], see: [], saw: [] };
                        $scope.$apply(changeView(vm.navList[0]));
                    }).catch(e => messageDisplay(e, 'error'))
            } else {
                vm.user.sign = true;
                scrollPagePrincipal(false);
            }
        };
        ///////////////////// FUCTION SHOW VIEW ///////////////////////
        function showFilm(film) {
            if (!film) {
                animate('film', 'fadeOutRight');
                animate('all', 'fadeIn');
                scrollPagePrincipal(true);
                lazyLoad(true);
                arrowUp(true);
                setTimeout(() => $scope.$apply(vm.view.film = false), 550);
                return;
            }
            film.page = 1;
            film.externalID = 'imdb_id';
            film.language = vm.search.language;
            filmsSaw(film);
            lazyLoad(false);
            arrowUp(false);
            fuctionFullMovie(film);
            scrollPagePrincipal(false);
        };
        ///////////////// FUCTION MENU CLICK LEFT /////////////////////
        function menuClick() {
            if (vm.view.menu.menu) vm.view.menu.menu = false;
            else vm.view.menu.menu = true;
        }
        ////////////////// FUCTION BAR LEFT HIDE //////////////////////
        function showHideBarLeft(nav) {
            if (nav != vm.navList[0] || vm.search.title.length > 0) vm.view.barLeft = false;
            else { if ($('html')[0].clientWidth > 768) vm.view.barLeft = true; }
        }
        ////////////////////// OTHER FUCTION //////////////////////////
        function fuctionGenres(object, type) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.genreList = loaded;
                }).catch(e => messageDisplay(e, 'error'));
        };
        function fuctionMovie(object, type, animated) {
            InterSF
                .getMoviesData(object, type)
                .then(loaded => {
                    vm.films.data = InterSF.addArrayInArray(vm.films, loaded.data);
                    if (animated) animate('container-films', 'fadeIn');
                    vm.films.total = loaded.total;
                    vm.load = false;
                }).catch(e => messageDisplay(e, 'error'));
        };
        function fuctionFullMovie(object) {
            InterSF
                .getMovieDataFull(object)
                .then(loaded => {
                    vm.film = {};
                    vm.film = loaded;
                    if (!vm.view.film) animate('all', 'fadeOut');
                    $scope.$apply(vm.view.film = true);
                }).catch(e => messageDisplay(e, 'error'));
        };
        function onsizeScreen(e) {
            e.preventDefault;
            if (e.target.innerWidth > 992) {
                vm.view.menu.menu = false;
                if (vm.search.title.length == 0) vm.view.barLeft = true;
                else vm.view.barLeft = false;
                vm.view.menu.filter = false;
            } else if (e.target.innerWidth < 992) {
                vm.view.barLeft = false;
            } $scope.$apply();
        };
        /////////////////////// FUCTION CSS /////////////////////////
        function lazyLoad(start) {
            if (start) $(window).on('scroll', lazyLoadScroll);
            else $(window).off('scroll', lazyLoadScroll);
        };
        function lazyLoadScroll() {
            if (vm.view.view == vm.navList[2] || vm.view.view == vm.navList[3] || vm.view.view == vm.navList[4] || vm.films.total.split('.').join() <= 20) return;
            if ($(window).scrollTop() + $('html')[0].clientHeight == $('html').innerHeight()) (vm.search.resetFilter) ? searchMovies('Y') : getMovieFilter('Y');
        };
        function arrowUp(start) {
            if (start) $(window).on('scroll', arrowUpScroll);
            else $(window).off('scroll', arrowUpScroll);
        };
        function arrowUpScroll() {
            if ($(window).scrollTop() > ($('html')[0].clientHeight * 2)) { if (!vm.view.arrowUp) $scope.$apply(vm.view.arrowUp = true); }
            else {
                if (vm.view.arrowUp) {
                    animate('arrowUp', 'fadeOut');
                    clearInterval(vm.timeout.arrowUp);
                    vm.timeout.arrowUp = setTimeout(() => $scope.$apply(vm.view.arrowUp = false), 90);
                }
            }
        };
        function moveScroll() {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        };
        function scrollPagePrincipal(view) {
            if (view) { $('html').css('overflow', 'scroll'); }
            else { $('html').css('overflow', 'hidden'); }
        };
        function animate(type, animate) {
            if (type == 'all') $('.films-all-general').animateCss(animate);
            else if (type == 'container-films') $('.films-container-directive').animateCss(animate);
            else if (type == 'film') $('.film-selected-general').animateCss(animate);
            else if (type == 'arrowUp') $('.arrow-up-container').animateCss(animate);
            else $('.films-all-container').animateCss(animate);
        };
        function teclado(bool) {
            if (bool) {
                $('html').on('keydown', (e) => {
                    if (e.keyCode === 27) { if (vm.view.film) showFilm(); }
                });
            } else $('html').off('keydown');
        };
        function configAnimatedJQuery() {
            $.fn.extend({
                animateCss: function (animationName, callback) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    this.addClass('animated ' + animationName).one(animationEnd, function () {
                        $(this).removeClass('animated ' + animationName);
                        if (callback) callback();
                    });
                    return this;
                }
            });
        };
    };
})();