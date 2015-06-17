/* global require, module */
'use strict';

var path            = require('path');

var moduleBase      = path.join(process.cwd(), 'api', 'node_modules');
var serverBase      = path.join(process.cwd(), 'server');
var debugBase       = path.join(moduleBase, 'ember-cli', 'node_modules', 'debug');

var appFile         = path.join(serverBase, 'assets', 'api.js');
var vendorFile      = path.join(serverBase, 'assets', 'vendor.js');
var emberAppFile    = path.join(moduleBase, 'ember-cli-fastboot', 'lib', 'models', 'ember-app.js');

var debug           = require(debugBase)('peakchat-api:middleware');

var WebSocketServer = require('ws')['Server'];
var EmberApp        = require(emberAppFile);

module.exports = function api(app, options) {
  try {
    var emberApp = new EmberApp({
      appFile: appFile,
      vendorFile: vendorFile
    });
  } catch(e) {
    debug('emberApp error %o', e);
  }

  var sockets = new WebSocketServer({
    server: options.httpServer,
    path: '/api'
  });

  sockets.on('connection', function(socket) {
    socket.on('message', function(data /*, flags */) {
      options.ui.writeLine('Got message');
      options.ui.writeLine(data);
    });
  });
};
