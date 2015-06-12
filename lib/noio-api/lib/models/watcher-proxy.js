'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var Task    = require('ember-cli/lib/models/task');

module.exports = Task.extend({
  then: function() {
    return Promise.all([
      this.buildWatcher.then.apply(this.watcher, arguments),
      this.serverWatcher.then.apply(this.watcher, arguments)
    ]);
  },

  on: function() {
    this.buildWatcher.on.apply(this.buildWatcher, arguments);
    this.serverWatcher.on.apply(this.serverWatcher, arguments);
  },

  off: function() {
    this.buildWatcher.off.apply(this.buildWatcher, arguments);
    this.serverWatcher.off.apply(this.serverWatcher, arguments);
  }
});
