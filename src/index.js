var angular = require('angular');

// Components
var hello = require('./app/hello/hello');
var goodbye = require('./app/goodbye/goodbye');

// Routing
require('angular-ui-router');
var routesConfig = require('./routes');

// Scss
require('./index.scss');

// App
var app = 'app';
module.exports = app;

// Init
angular
  .module(app, ['ui.router'])
  .config(routesConfig)
  .component('app', hello)
  .component('goodbye', goodbye);
