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
                min: '<',
                max: '<',
                maxValue: '<',
                minValue: '<',
                ngChangeSlider: '&'
            },
        });
    ////////////////////////////////////////////////////////////
    NgSliderOwnController.$inject = [];
    function NgSliderOwnController() {
        let $ctrl = this;
        $ctrl.MaxXY = 0;
        $ctrl.MinXY = 0;
        $ctrl.mouseX = 0;
        $ctrl.posMinX = 0;
        $ctrl.posMaxX = 0;
        $ctrl.widthMax = 0;
        $ctrl.widthMin = 0;
        $ctrl.minDefault = 0;
        $ctrl.containerXY = 0;
        $ctrl.maxDefault = 100;
        $ctrl.containerSizeX = 0;
        $ctrl.minValueDefault = 25;
        $ctrl.maxValueDefault = 75;
        ////////////////////////////////////////////////////////////
        $ctrl.$onInit = () => { };
        $ctrl.$onChanges = (changes) => { configSlider(); };
        $ctrl.$onDestroy = () => { stopSlider(); };
        ////////////////////////////////////////////////////////////
        function configSlider() {
            $('.component-slider-container').off('mousedown');
            $('.component-slider-container').off('mousemove');
            if (!$ctrl.min || !$ctrl.max || !$ctrl.minValue || !$ctrl.maxValue) {
                $ctrl.min = $ctrl.minDefault;
                $ctrl.max = $ctrl.maxDefault;
                $ctrl.minValue = $ctrl.minValueDefault;
                $ctrl.maxValue = $ctrl.maxValueDefault;
            }
            $ctrl.containerSizeX = $('.component-slider-container').outerWidth();
            let mouseXMin = calcValueSlider($ctrl.minValue) * $ctrl.containerSizeX / 100;
            let mouseXMax = calcValueSlider($ctrl.maxValue) * $ctrl.containerSizeX / 100;
            $('#component-slider-value-min').text(represent2LastNumString($ctrl.minValue));
            $('#component-slider-value-max').text(represent2LastNumString($ctrl.maxValue));
            $('.component-slider-container > .component-slider-progressMin').css('width', (mouseXMin - 7) + 'px');
            $('.component-slider-container > .component-slider-indicator-min').css('left', (mouseXMin - 7) + 'px');
            $('.component-slider-container > .component-slider-progressMedium').css('width', (mouseXMax - 7) + 'px');
            $('.component-slider-container > .component-slider-indicator-max').css('left', (mouseXMax - 7) + 'px');
            $('.component-slider-general').on('mousedown', initSlider);
        };
        function reCalcValueSlider(e) {
            /* Container */
            $ctrl.containerSizeX = $(e.currentTarget).outerWidth();
            $ctrl.containerXY = $(e.currentTarget).offset();
            /* Indicator Slider Min */
            $ctrl.widthMin = $('.component-slider-indicator-min').outerWidth();
            $ctrl.MinXY = $('.component-slider-indicator-min').offset();
            $ctrl.posMinX = e.pageX - $ctrl.MinXY.left;
            /* Indicator Slider Max */
            $ctrl.widthMax = $('.component-slider-indicator-max').outerWidth();
            $ctrl.MaxXY = $('.component-slider-indicator-max').offset();
            $ctrl.posMaxX = e.pageX - $ctrl.MaxXY.left;
            /* Mouse sobre el slider */
            $ctrl.mouseX = e.pageX - $ctrl.containerXY.left;
        };
        function initSlider(e) {
            $(window).mouseup(() => { $('.component-slider-general').off('mousemove'); });
            reCalcValueSlider(e);
            if ($ctrl.mouseX < 0) return;
            else if ($ctrl.mouseX >= 0 && $ctrl.mouseX < ($ctrl.MinXY.left - (3 / 2 * $ctrl.widthMin))) moveSliderMin(e);
            else if ($ctrl.mouseX > ($ctrl.MaxXY.left - $ctrl.containerXY.left + $ctrl.widthMax / 2) && $ctrl.mouseX <= ($ctrl.containerSizeX + $ctrl.widthMax / 2)) moveSliderMax(e);
            $('.component-slider-general').on('mousemove', function (e) {
                reCalcValueSlider(e);
                if ($ctrl.mouseX < 0) $(this).off('mousemove');
                else if ($ctrl.mouseX >= 0 && $ctrl.mouseX < ($ctrl.MinXY.left - (3 / 2 * $ctrl.widthMin))) moveSliderMin(e);
                else if ($ctrl.mouseX > ($ctrl.MaxXY.left - $ctrl.containerXY.left + $ctrl.widthMax / 2) && $ctrl.mouseX <= ($ctrl.containerSizeX + $ctrl.widthMax / 2)) moveSliderMax(e);
            });
        };
        function moveSliderMin(e) {
            reCalcValueSlider(e);
            $ctrl.minValue = Math.round(calcValueReal($ctrl.mouseX * 100 / $ctrl.containerSizeX));
            if ($ctrl.minValue < $ctrl.min) $ctrl.minValue = $ctrl.min;
            if ($ctrl.mouseX >= 0 && $ctrl.mouseX <= $ctrl.containerSizeX && $ctrl.posMaxX < 18) {
                $('.component-slider-container > .component-slider-progressMin').css('width', ($ctrl.mouseX - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-min').css('left', ($ctrl.mouseX - 7) + 'px');
                $('#component-slider-value-min').text(Math.round(represent2LastNumString($ctrl.minValue)));
                $('.component-slider-indicator-min').css('z-index', 6);
                $('.component-slider-indicator-max').css('z-index', 5);
                $ctrl.ngChangeSlider({ min: $ctrl.minValue, max: $ctrl.maxValue });
            }
        };
        function moveSliderMax(e) {
            reCalcValueSlider(e);
            $ctrl.maxValue = Math.round(calcValueReal($ctrl.mouseX * 100 / $ctrl.containerSizeX));
            if ($ctrl.maxValue > $ctrl.max) $ctrl.maxValue = $ctrl.max;
            if ($ctrl.mouseX >= 0 && $ctrl.mouseX <= $ctrl.containerSizeX && $ctrl.posMinX >= 18) {
                $('.component-slider-container > .component-slider-progressMedium').css('width', ($ctrl.mouseX - 7) + 'px');
                $('.component-slider-container > .component-slider-indicator-max').css('left', ($ctrl.mouseX - 7) + 'px');
                $('#component-slider-value-max').text(Math.round(represent2LastNumString($ctrl.maxValue)));
                $('.component-slider-indicator-min').css('z-index', 5);
                $('.component-slider-indicator-max').css('z-index', 6);
                $ctrl.ngChangeSlider({ min: $ctrl.minValue, max: $ctrl.maxValue });
            }
        };
        function stopSlider() {
            $('.component-slider-general').off('mousedown');
            $('.component-slider-general').off('mousemove');
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