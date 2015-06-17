/* global require, module */
'use strict';

var EmberApp      = require('ember-cli/lib/broccoli/ember-app');

var defaults      = require('lodash/object/defaults');
var fs            = require('fs');
var merge         = require('lodash/object/merge');
var path          = require('path');
var unwatchedTree = require('broccoli-unwatched-tree');

function EmberApi(options) {
  options = options || {};
  process.env.EMBER_ADDON_ENV = process.env.EMBER_ADDON_ENV || 'development';

  this.appConstructor(merge(options, {
    name: 'api',
    configPath: './api/config/environment',
    trees: {
      app: 'api/app',
      tests: 'api/tests',
      styles: unwatchedTree('api/app/styles'),
      templates: fs.existsSync('api/app/templates') ? unwatchedTree('api/app/templates') : null,
      bower: unwatchedTree(this.bowerDirectory),
      vendor: fs.existsSync('api/vendor') ? unwatchedTree('api/vendor') : null,
      public: fs.existsSync('api/public') ? 'api/public' : null
    }
  }, defaults));
}

EmberApi.prototype = Object.create(EmberApp.prototype);
EmberApi.prototype.constructor = EmberApi;
EmberApi.prototype.appConstructor = EmberApp.prototype.constructor;

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = function(project) {
  return new EmberApi({ options: project });
}
