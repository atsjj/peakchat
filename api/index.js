import Peering from './lib/peering';
import { Server as WebSocketServer } from 'ws';

import signalingServer from './signaling-server';

export default function api(app, options) {
  signalingServer(app, options);

  var peering = new Peering({
    ui: options.ui
  });

  var sockets = new WebSocketServer({
    server: options.httpServer,
    path: '/api'
  });

  sockets.on('connection', peering.connect.bind(peering));
}
