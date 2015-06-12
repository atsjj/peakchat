/* jshint node: true, strict: true */
/* global module, require */

'use strict';

var commands = require('./lib/commands');

module.exports = {
  name: 'noio-api',

  isDevelopingAddon: function() {
    return true;
  },

  includedCommands: function() {
    return commands;
  }
};
