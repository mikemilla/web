// CSS change listeners
// Fires when a css change is set
(function () {
    orig = $.fn.css;
    $.fn.cssWithListener = function () {
        var result = orig.apply(this, arguments);
        $(this).trigger(cssValue);
        return result;
    }
})();