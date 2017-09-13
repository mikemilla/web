// Fires when a css change is set
orig = $.fn.css;
$.fn.cssWithListener = function () {
    var result = orig.apply(this, arguments);
    $(this).trigger(cssValue);
    return result;
}