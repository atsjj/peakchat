var Peer = require('./peer');
var dictionary = require('./dictionary');
var uuid = require('./uuid');

module.exports = Peering;

function Peering(options) {
  this.channels = dictionary(null);
  this.peers = dictionary(null);
  this.peerAnnoucementsMap = dictionary(null);
  this.ui = options.ui;
}

Peering.prototype.connect = function peeringConnect(socket) {
  var id = uuid();
  var peer = this.peers[id] = new Peer(id, this, socket);
  var self = this;

  socket.on('close', function() { self.closePeer.call(self, peer); });

  this.ui.writeLine('[peering:connect] opened peer@' + id);
};

Peering.prototype.send = function peeringSend(message) {
  for (var peer in this.peers) {
    this.peers[peer].send.call(this.peers[peer], message);
  }

  this.ui.writeLine('[peering:send] sent message to all peers');
};

Peering.prototype.closePeer = function peeringClosePeer(peer) {
  this.peers[peer.id] = null;
  delete this.peers[peer.id];

  this.ui.writeLine('[peering:closePeer] closed peer@' + peer.id);
};
