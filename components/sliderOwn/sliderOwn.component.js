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
                maxValue: '=',
                minValue: '=',
                ngChangeSlider: '&'
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
        $ctrl.$onInit = () => {
            if($ctrl.init) {
                $ctrl.init = false;
                configSlider();
            }
            initSlider();
        };
        $ctrl.$onChanges = () => { 
            configSlider();
        };
        $ctrl.$onDestroy = () => {
            stopSlider();
        };
        ////////////////////////////////////////////////////////////
        function configSlider() {
            if (!$ctrl.min || !$ctrl.max || !$ctrl.minValue || !$ctrl.maxValue) {
                $ctrl.min = $ctrl.minDefault;
                $ctrl.max = $ctrl.maxDefault;
                $ctrl.minValue = $ctrl.minValueDefault;
                $ctrl.maxValue = $ctrl.maxValueDefault;
            }
            let containerSizeX = $('.component-slider-general').outerWidth();
            let mouseXMin = calcValueSlider($ctrl.minValue) * containerSizeX / 100;
            let mouseXMax = calcValueSlider($ctrl.maxValue) * containerSizeX / 100;
            $('#component-slider-value-min').text(represent2LastNumString($ctrl.minValue));
            $('#component-slider-value-max').text(represent2LastNumString($ctrl.maxValue));
            $('.component-slider-container > .component-slider-progressMin').css('width', (mouseXMin - 7) + 'px');
            $('.component-slider-container > .component-slider-indicator-min').css('left', (mouseXMin - 7) + 'px');
            $('.component-slider-container > .component-slider-progressMedium').css('width', (mouseXMax - 7) + 'px');
            $('.component-slider-container > .component-slider-indicator-max').css('left', (mouseXMax - 7) + 'px');
        };
        function initSlider() {
            $('.component-slider-general').on('mousedown', function (e) {
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
            $ctrl.minValue = Math.round(calcValueReal(mouseX * 100 / containerSizeX));
            if($ctrl.minValue < $ctrl.min) $ctrl.minValue = $ctrl.min;
            if (mouseX >= 0 && mouseX <= containerSizeX && posMaxX < 18) {
                $('.component-slider-container > .component-slider-progressMin').css('width', (mouseX - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-min').css('left', (mouseX - 7) + 'px');
                $('#component-slider-value-min').text(Math.round(represent2LastNumString($ctrl.minValue)));
                $('.component-slider-indicator-min').css('z-index', 6);
                $('.component-slider-indicator-max').css('z-index', 5);
                $ctrl.ngChangeSlider();
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
            $ctrl.maxValue = Math.round(calcValueReal(mouseX * 100 / containerSizeX));
            if($ctrl.maxValue > $ctrl.max) $ctrl.maxValue = $ctrl.max;
            if (mouseX >= 0 && mouseX <= containerSizeX && posMinX >= 18) {
                $('.component-slider-container > .component-slider-progressMedium').css('width', (mouseX - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-max').css('left', (mouseX - 7) + 'px');
                $('#component-slider-value-max').text(Math.round(represent2LastNumString($ctrl.maxValue)));
                $('.component-slider-indicator-min').css('z-index', 5);
                $('.component-slider-indicator-max').css('z-index', 6);
                $ctrl.ngChangeSlider();
            }
        };
        function stopSlider() {
            $('.component-slider-container').off('mousedown');
            $('.component-slider-container').off('mousemove');
        };
        function calcValueSlider(real) {
            return Math.abs($ctrl.min - real) / (Math.abs($ctrl.max - $ctrl.min) / 100);
        };
        function calcValueReal(value) {
            return $ctrl.min + value * (Math.abs($ctrl.max - $ctrl.min) / 100);
        };
        function represent2LastNumString(value) {
            return String(value).substring(String(value).length - 2, String(value).length);
        };
    }
})();