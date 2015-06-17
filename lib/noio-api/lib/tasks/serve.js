/* jshint node: true */
'use strict';

var path              = require('path');

var Builder           = require('ember-cli/lib/models/builder');
var ServerBuilder     = require('../models/builder');
var ExpressServer     = require('ember-cli/lib/tasks/server/express-server');
var LiveReloadServer  = require('ember-cli/lib/tasks/server/livereload-server');
var Project           = require('ember-cli/lib/models/project');
var Promise           = require('ember-cli/lib/ext/promise');
var Task              = require('ember-cli/lib/models/task');
var Watcher           = require('ember-cli/lib/models/watcher');
var WatcherProxy      = require('../models/watcher-proxy');

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

    var apiPath = path.join(this.project.root, 'api');
    var apiPkg = require(path.join(apiPath, 'package.json'));
    var project = new Project(apiPath, apiPkg, this.ui, this.project.cli);
    project.bowerDirectory = path.join('api', project.bowerDirectory.toString());

    var app = require(path.join(apiPath, 'Brocfile.js'))(project);
    var outputPath = path.join(this.project.root, 'server');

    var serverBuilder = new ServerBuilder({
      ui: this.ui,
      outputPath: outputPath,
      project: project,
      environment: options.environment,
      tree: app.toTree()
    });

    var serverWatcher = new Watcher({
      ui: this.ui,
      builder: serverBuilder,
      analytics: this.analytics,
      options: options
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
