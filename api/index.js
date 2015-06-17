'use strict';

var bootstrap         = require('./bootstrap');
var debug             = require('ember-cli/node_modules/debug')('noio-api:child');

var Build             = require('ember-cli/lib/commands/build');
var Builder           = require('ember-cli/lib/models/builder');
var Promise           = require('ember-cli/lib/ext/promise');
var Task              = require('ember-cli/lib/models/task');
var Watcher           = require('ember-cli/lib/models/watcher');

var options = bootstrap({
  cliArgs: process.argv.slice(2),
  inputStream: process.stdin,
  outputStream: process.stdout
});

var buildCommand = new Build({
  ui:        options.ui,
  analytics: options.analytics,
  commands:  options.environment.commands,
  tasks:     options.environment.tasks,
  project:   options.environment.project,
  settings:  options.environment.settings,
  testing:   options.testing,
  cli:       options.cli
});

var args = options.environment.cliArgs.slice();
var commandOptions = buildCommand.parseArgs(args);

function safe(k, v) {
  switch(k) {
    case 'inputTrees':
    case 'options':
    case 'subtrees':
      return undefined;
  }
  return v;
}

var ProxyWatcher = Task.extend({
  init: function() {
    if (this.watcher) {
      this.watcher.on('change', this.watcherDidChange.bind(this));
      this.watcher.on('error', this.watcherDidError.bind(this));
    }
  },

  on: function() {
    this.emitter.on.apply(this.emitter, arguments);
  },

  off: function() {
    this.emitter.off.apply(this.emitter, arguments);
  },

  watcherDidChange: function(results) {
    debug('watcherDidChange %o', results);

    try {
      var payload = JSON.stringify({ 'child-watcher:change': results }, safe);
      debug('watcherDidChange payload %s', payload);
      process.send(payload);
    } catch(e) {
      debug('watcherDidChange payload error %o', e);
    }
  },

  watcherDidError: function(error) {
    debug('watcherDidError %o', error);

    try {
      var payload = JSON.stringify({ 'child-watcher:error': error }, safe);
      debug('watcherDidError payload %s', payload);
      process.send(payload);
    } catch(e) {
      debug('watcherDidChange payload error %o', e);
    }
  }
});

var BuildWatchTask = Task.extend({
  run: function(options) {
    var watcher = new Watcher({
      ui: this.ui,
      builder: new Builder({
        ui: this.ui,
        outputPath: options.outputPath,
        environment: options.environment,
        project: this.project
      }),
      analytics: this.analytics,
      options: options
    });

    var proxyWatcher = new ProxyWatcher({
      watcher: watcher
    });

    return watcher.then(function() {
      return new Promise(function () {}); // Run until failure or signal to exit
    });
  }
});

var buildWatchTask = new BuildWatchTask({
  analytics: options.analytics,
  project: options.project,
  ui: options.ui
});

buildWatchTask.run(commandOptions.options);
