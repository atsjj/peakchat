/* jshint node: true */
'use strict';

var path              = require('path');

var Builder           = require('ember-cli/lib/models/builder');
var ExpressServer     = require('ember-cli/lib/tasks/server/express-server');
var LiveReloadServer  = require('ember-cli/lib/tasks/server/livereload-server');
var Promise           = require('ember-cli/lib/ext/promise');
var Task              = require('ember-cli/lib/models/task');
var Watcher           = require('ember-cli/lib/models/watcher');
var WatcherProxy      = require('../models/watcher-proxy');
var ChildWatcher      = require('../models/child-watcher');

module.exports = Task.extend({
  buildConsole: function() {
    var ui = this.ui;

    if (!ui) {
      this.console = console;
      return;
    }

    this.console = {
      log: function(data) {
        ui.writeLine(data);
      },

      error: function(data) {
        ui.writeLine(data, 'ERROR');
      }
    }
  },

  run: function(options) {
    this.buildConsole();

    var moduleBase = path.join(this.project.root, 'api');
    var modulePath = path.join(moduleBase, 'index.js');
    var outputPath = path.join(this.project.root, 'server');

    var serverWatcher = new ChildWatcher({
      modulePath: modulePath,
      args: ['--output-path', outputPath, '--watch', '--watcher', 'watchman'],
      options: { cwd: moduleBase }
    });

    var builder = new Builder({
      ui: this.ui,
      outputPath: options.outputPath,
      project: this.project,
      environment: options.environment
    });

    var watcher = new Watcher({
      ui: this.ui,
      builder: builder,
      analytics: this.analytics,
      options: options
    });

    var serverRoot = './server';
    var expressServer = new ExpressServer({
      ui: this.ui,
      project: this.project,
      watcher: watcher,
      serverRoot: serverRoot,
      serverWatcher: serverWatcher
    });

    var watcherProxy = new WatcherProxy({
      buildWatcher: watcher,
      serverWatcher: serverWatcher
    });

    var liveReloadServer = new LiveReloadServer({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project,
      watcher: watcherProxy,
      expressServer: expressServer
    });

    var promises = [
      liveReloadServer.start(options),
      expressServer.start(options)
    ];

    return Promise.all(promises)
      .then(function() {
        return new Promise(function() { /* hang until the user exits. */ });
      });
  }
});
