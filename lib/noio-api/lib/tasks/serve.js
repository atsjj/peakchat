/* jshint node: true */
'use strict';

var fs                = require('fs-extra');
var path              = require('path');
var babelTranspiler   = require('broccoli-babel-transpiler');
var jshintTrees       = require('broccoli-jshint');
var mergeTrees        = require('broccoli-merge-trees');

var Builder           = require('ember-cli/lib/models/builder');
var ServerBuilder     = require('../models/builder');
var ExpressServer     = require('ember-cli/lib/tasks/server/express-server');
var Funnel            = require('broccoli-funnel');
var LiveReloadServer  = require('ember-cli/lib/tasks/server/livereload-server');
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

    var serverOutputPath = 'server/';
    var serverBuilder = new ServerBuilder({
      ui: this.ui,
      outputPath: serverOutputPath,
      project: this.project,
      environment: options.environment,
      tree: tree.call(this)
    });

    var serverWatcher = new Watcher({
      ui: this.ui,
      builder: serverBuilder,
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

function tree() {
  var trees = [];

  if(this.project.has('api')) {
    var apiTree = new Funnel('api/', {
      srcDir: '/',
      include: [ new RegExp('^.*\.js$') ],
      destDir: 'es6/',
      description: 'Funnel: Api JS'
    });

    var lintApiTree = jshintTrees(apiTree, {
      description: 'JSHint Api- QUnit',
      console: this.console
    });

    var apiJs = babelTranspiler(apiTree);
    apiJs.description = 'ES6: Api JS Files';

    var jshintedApiTree = new Funnel(lintApiTree, {
      srcDir: 'es6/',
      destDir: 'tests/',
      description: 'Funnel: JSHint Api'
    });

    var compiledApiTree = new Funnel(apiJs, {
      srcDir: 'es6/',
      destDir: '/',
      description: 'Funnel: Transpiled Api JS'
    });

    trees.push(compiledApiTree);
    trees.push(jshintedApiTree);
  }

  return mergeTrees(trees, {
    description: 'TreeMerge (api)'
  });
}
