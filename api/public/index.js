/* global require, module */
'use strict';

var WebSocketServer = require('ws')['Server'];

module.exports = function api(app, options) {
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
