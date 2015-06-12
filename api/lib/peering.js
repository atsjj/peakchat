import Peer from './peer';

import dictionary from './dictionary';
import uuid from './uuid';

export default class Peering {
  constructor(options) {
    this.peers = dictionary(null);
    this.peerAnnoucementsMap = dictionary(null);
    this.ui = options.ui;
  }

  connect(socket) {
    var id = uuid();
    var peer = this.peers[id] = new Peer(id, this, socket);
    var self = this;

    socket.on('message', peer.message.bind(peer));
    socket.on('message', this.message.bind(this));
    socket.on('close', function() { self.closePeer.call(self, peer); });

    this.ui.writeLine('[peering:connect] opened peer@' + id);
  }

  send(message) {
    for (var peer in this.peers) {
      this.peers[peer].send.call(this.peers[peer], message);
    }

    this.ui.writeLine('[peering:send] sent message to all peers');
  }

  message(data /*, flags */) {
    var message = JSON.parse(data);

    switch(message['type']) {
      case 'annoucement':
      case 'scrape':
        this.handleScrape(message);
        break;
    }

    this.ui.writeLine('[peering:peeringMessage] called.');
  }

  handleScrape() {
    var annoucements = dictionary(null);
    annoucements['type'] = 'annoucements';
    annoucements['annoucements'] = [];

    for (var peer in this.peers) {
      annoucements['annoucements'].push(this.peers[peer].annoucement);
    }

    this.send(annoucements);
  }

  closePeer(peer) {
    this.peers[peer.id] = null;
    delete this.peers[peer.id];

    this.ui.writeLine('[peering:closePeer] closed peer@' + peer.id);
  }
}
