'use strict';

var debug         = require('ember-cli/node_modules/debug')('noio-api:child-watcher');

var ChildProcess  = require('child_process');
var EventEmitter  = require('events').EventEmitter;
var Promise       = require('ember-cli/lib/ext/promise');
var Task          = require('ember-cli/lib/models/task');

module.exports = Task.extend({
  init: function() {
    this.childProcess = ChildProcess.fork(this.modulePath, this.args, this.options);
    this.emitter = new EventEmitter();
    this.promise = new Promise(function() {});

    this.childProcess.on('message', this.didMessage.bind(this));
  },

  didMessage: function(message) {
    var data = JSON.parse(message);

    if (data && data['child-watcher:change']) {
      this.didChange.call(this, data['child-watcher:change']);
    }

    if (data && data['child-watcher:error']) {
      this.didError.call(this, data['child-watcher:error']);
    }
  },

  didError: function(error) {
    debug('didError %o', error);
    this.emitter.emit('error', error);
  },

  then: function() {
    return this.promise.then.apply(this.promise, arguments);
  },

  didChange: function(results) {
    debug('didChange %o', results);
    this.emitter.emit('change', results);
  },

  on: function() {
    this.emitter.on.apply(this.emitter, arguments);
  },

  off: function() {
    this.emitter.off.apply(this.emitter, arguments);
  },
});
