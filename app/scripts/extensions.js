// Fires when a css change is set
orig = $.fn.css;
$.fn.cssWithListener = function () {
    var result = orig.apply(this, arguments);
    $(this).trigger(cssValue);
    return result;
}

// Forces view to be redrawn
$.fn.redraw = function () {
    $(this).each(function () {
        var redraw = this.offsetHeight;
    });
};