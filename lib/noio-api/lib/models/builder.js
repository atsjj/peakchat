/* jshint node: true */
'use strict';

var Builder = require('ember-cli/lib/models/builder');

module.exports = Builder.extend({
  setupBroccoliBuilder: function() {
    this.environment = this.environment || 'development';
    process.env.EMBER_ENV = process.env.EMBER_ENV || this.environment;

    var broccoli = require('broccoli');
    this.builder = new broccoli.Builder(this.tree);
  }
});
