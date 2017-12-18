(function () {
    'use strict';
    ////////////////////////////////////////////////////////////
    // Usage:
    // 
    // Creates:
    // 
    ////////////////////////////////////////////////////////////
    angular
        .module('PelisEOI')
        .component('ngSliderOwn', {
            templateUrl: '/components/sliderOwn/sliderOwn.html',
            controller: NgSliderOwnController,
            controllerAs: '$ctrl',
            bindings: {
                min: '=',
                max: '=',
                minValue: '=',
                maxValue: '='
            },
        });
    ////////////////////////////////////////////////////////////
    NgSliderOwnController.$inject = [];
    function NgSliderOwnController() {
        let $ctrl = this;
        $ctrl.init = true;
        $ctrl.minDefault = 0;
        $ctrl.maxDefault = 100;
        $ctrl.minValueDefault = 25;
        $ctrl.maxValueDefault = 75;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = function () {
            configSlider();
            initSlider();
        };
        $ctrl.$onChanges = function (changesObj) {
            console.log(changesObj);
        };
        $ctrl.$onDestroy = function () {
            stopSlider();
        };
        ////////////////////////////////////////////////////////////
        function configSlider() {
            if ($ctrl.init) {
                $ctrl.init = false;
                let containerSizeX = $('.component-slider-general').outerWidth();
                let mouseXMin = $ctrl.minValueDefault * containerSizeX / 100;
                let mouseXMax = $ctrl.maxValueDefault * containerSizeX / 100;
                $('#component-slider-value-min').text(Math.round($ctrl.minValueDefault));
                $('#component-slider-value-max').text(Math.round($ctrl.maxValueDefault));
                $('.component-slider-container > .component-slider-progressMin').css('width', (mouseXMin - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-min').css('left', (mouseXMin - 7) + 'px');
                $('.component-slider-container > .component-slider-progressMedium').css('width', (mouseXMax - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-max').css('left', (mouseXMax - 7) + 'px');
                $('.component-slider-indicator-min').css('color', 'white');
                $('.component-slider-indicator-max').css('color', 'white');
            }
        }
        function initSlider() {
            $('.component-slider-general').on('mousedown', function (e) {
                configSlider();
                /* Container */
                let containerSizeX = $(e.currentTarget).outerWidth();
                let containerXY = $(e.currentTarget).offset();
                /* Mouse sobre el slider */
                let mouseX = e.pageX - containerXY.left;
                /* Indicator Slider Min */
                let widthMin = $('.component-slider-indicator-min').outerWidth();
                let MinXY = $('.component-slider-indicator-min').offset();
                let posMinX = e.pageX - MinXY.left;
                /* Indicator Slider Max */
                let widthMax = $('.component-slider-indicator-max').outerWidth();
                let MaxXY = $('.component-slider-indicator-max').offset();
                let posMaxX = e.pageX - MaxXY.left;
                if (mouseX < (MinXY.left - widthMin) && mouseX >= 0) {
                    moveSliderMin(e);
                } else if (mouseX > (MaxXY.left - containerXY.left) && mouseX <= (containerSizeX + widthMax / 2)) {
                    moveSliderMax(e);
                }
                $(this).on('mousemove', function (e) {
                    if (mouseX >= 0 && mouseX < (MinXY.left - widthMin)) {
                        moveSliderMin(e);
                    } else if (mouseX > (MaxXY.left - containerXY.left) && mouseX <= (containerSizeX + widthMax / 2)) {
                        moveSliderMax(e);
                    }
                });
            }).on('mouseup', function () {
                $(this).off('mousemove');
            });
        };
        function moveSliderMin(e) {
            e.preventDefault();
            /* Container */
            let containerSizeX = $(e.currentTarget).outerWidth();
            let containerXY = $(e.currentTarget).offset();
            /* Indicator Slider Min */
            let widthMin = $('.component-slider-indicator-min').outerWidth();
            let MinXY = $('.component-slider-indicator-min').offset();
            let posMinX = e.pageX - MinXY.left;
            let MinSizeX = $('.component-slider-indicator-min').outerWidth();
            /* Indicator Slider Max */
            let widthMax = $('.component-slider-indicator-max').outerWidth();
            let MaxXY = $('.component-slider-indicator-max').offset();
            let posMaxX = e.pageX - MaxXY.left;
            /* Mouse sobre el slider */
            let mouseX = e.pageX - containerXY.left;
            /* value min */
            $ctrl.minValue = mouseX * 100 / containerSizeX;
            if (mouseX >= 0 && mouseX <= containerSizeX && posMaxX < 18) {
                $('.component-slider-container > .component-slider-progressMin').css('width', (mouseX - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-min').css('left', (mouseX - 7) + 'px');
                $('#component-slider-value-min').text(Math.round($ctrl.minValue));
                $('.component-slider-indicator-min').css('z-index', 6);
                $('.component-slider-indicator-max').css('z-index', 5);
            }
        };
        function moveSliderMax(e) {
            e.preventDefault();
            /* Container */
            let containerSizeX = $(e.currentTarget).outerWidth();
            let containerXY = $(e.currentTarget).offset();
            /* Indicator Slider Min */
            let widthMin = $('.component-slider-indicator-min').outerWidth();
            let MinXY = $('.component-slider-indicator-min').offset();
            let posMinX = e.pageX - MinXY.left;
            /* Indicator Slider Max */
            let widthMax = $('.component-slider-indicator-max').outerWidth();
            let MaxXY = $('.component-slider-indicator-max').offset();
            let posMaxX = e.pageX - MaxXY.left;
            /* Mouse sobre el slider */
            let mouseX = e.pageX - containerXY.left;
            /* value max */
            $ctrl.maxValue = mouseX * 100 / containerSizeX;
            if (mouseX >= 0 && mouseX <= containerSizeX && posMinX >= 18) {
                $('.component-slider-container > .component-slider-progressMedium').css('width', (mouseX - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-max').css('left', (mouseX - 7) + 'px');
                $('#component-slider-value-max').text(Math.round($ctrl.maxValue));
                $('.component-slider-indicator-min').css('z-index', 5);
                $('.component-slider-indicator-max').css('z-index', 6);
            }
        };
        function stopSlider() {
            $('.component-slider-container').off('mousedown');
            $('.component-slider-container').off('mousemove');
        };
    }
})();