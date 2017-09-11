// Variables
var portfolio = [];
var isMobile = false;

// References
const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
const domInsertionValue = 'DOMNodeInserted';
const cssValue = 'stylechanged';
const backPressValue = 'popstate';
const videoType = 'video';
const gifType = 'gif';
const imageType = 'img';

// Views
const view = $('html, body');
const body = $('body');

// Browsers
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);