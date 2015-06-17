'use strict';

// Main entry point
var Project       = require('ember-cli/lib/models/project');
var requireAsHash = require('ember-cli/lib/utilities/require-as-hash');
var Command       = require('ember-cli/lib/models/command');
var commands      = requireAsHash('ember-cli/lib/commands/*.js', Command);
var Task          = require('ember-cli/lib/models/task');
var tasks         = requireAsHash('ember-cli/lib/tasks/*.js', Task);
var CLI           = require('ember-cli/lib/cli/cli');
var packageConfig = require('ember-cli/package.json');
var debug         = require('ember-cli/node_modules/debug')('api:index');
var merge         = require('ember-cli/node_modules/lodash/object/merge');
var path          = require('path');

var version      = packageConfig.version;
var name         = packageConfig.name;
var trackingCode = packageConfig.trackingCode;

function clientId() {
  var ConfigStore = require('ember-cli/node_modules/configstore');
  var configStore = new ConfigStore('ember-cli');
  var id = configStore.get('client-id');

  if (id) {
    return id;
  } else {
    id = require('node-uuid').v4().toString();
    configStore.set('client-id', id);
    return id;
  }
}

// Options: Array cliArgs, Stream inputStream, Stream outputStream
module.exports = function(options) {
  // Options: Array cliArgs, Stream inputStream, Stream outputStream
  var UI = options.UI || require('ember-cli/lib/ui');
  var Leek = options.Leek || require('ember-cli/node_modules/leek');
  var Yam = options.Yam || require('ember-cli/node_modules/yam');

  // TODO: one UI (lib/models/project.js also has one for now...)
  var ui = new UI({
    inputStream:  options.inputStream,
    outputStream: options.outputStream,
    ci:           process.env.CI || /^(dumb|emacs)$/.test(process.env.TERM),
    writeLevel:   ~process.argv.indexOf('--silent') ? 'ERROR' : undefined
  });

  var config = new Yam('ember-cli', {
    primary: Project.getProjectRoot()
  });

  var leekOptions;

  var disableAnalytics = options.cliArgs &&
    (options.cliArgs.indexOf('--disable-analytics') > -1 ||
    options.cliArgs.indexOf('-v') > -1 ||
    options.cliArgs.indexOf('--version') > -1) ||
    config.get('disableAnalytics');

  var defaultLeekOptions = {
    trackingCode: trackingCode,
    globalName:   name,
    name:         clientId(),
    version:      version,
    silent:       disableAnalytics
  };

  var defaultUpdateCheckerOptions = {
    checkForUpdates: true
  };

  if (config.get('leekOptions')) {
    leekOptions = merge(defaultLeekOptions, config.get('leekOptions'));
  } else {
    leekOptions = defaultLeekOptions;
  }

  debug('leek: %o', leekOptions);

  var leek = new Leek(leekOptions);

  var cli = new CLI({
    ui:        ui,
    analytics: leek,
    testing:   options.testing,
    name: options.cli ? options.cli.name : 'ember',
    root: options.cli ? options.cli.root : path.resolve(__dirname, '..', '..'),
    npmPackage: options.cli ? options.cli.npmPackage : 'ember-cli'
  });

  var project = Project.projectOrnullProject(ui, cli);

  var environment = {
    tasks:    tasks,
    cliArgs:  options.cliArgs,
    commands: commands,
    project:  project,
    settings: merge(defaultUpdateCheckerOptions, config.getAll())
  };

  return {
    analytics: leek,
    cli: cli,
    environment: environment,
    project: project,
    testing: options.testing,
    ui: ui
  };
};
