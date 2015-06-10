var dictionary = require('./dictionary');

module.exports = Peer;

function Peer(id, peering, socket) {
  this.id = id;
  this.peering = peering;
  this.socket = socket;

  this.annoucement = null;

  // The `peer` instance will listen for the following events.
  socket.on('message',  this.message.bind(this));
  socket.on('error',    this.error.bind(this));
  socket.on('close',    this.close.bind(this));
}

Peer.prototype.send = function(message) {
  this.socket.send(message);

  this.peering.ui.writeLine('[peer:send] sent message to peer@' + this.id);
};

Peer.prototype.message = function peerMessage(data /*, flags */) {
  var message = dictionary(JSON.parse(data));

  switch(message['type']) {
    case 'annoucement':
      this.handleAnnoucement(message);
      break;
  }

  this.peering.ui.writeLine('[peer:peerMessage] called.');
};

Peer.prototype.handleAnnoucement = function peerHandleAnnoucement(annoucement) {
  if (this.annoucement === null) {
    this.peering.peerAnnoucementsMap[annoucement['id']] = this.id;
    this.annoucement = annoucement;
    return ;
  }

  if (this.annoucement['id'] === annoucement['id']) {
    this.annoucement = annoucement;
  } else {
    this.peering.ui.writeLine('[peer:handleAnnoucement] error, `id` mismatch.');
  }
};

Peer.prototype.error = function peerError(/* error */) {
  this.peering.ui.writeLine('[peer:peerError] called.');
};

Peer.prototype.close = function peerClose(/* code, message */) {
  this.peering.peerAnnoucementsMap[this.annoucement['id']] = null;
  delete this.peering.peerAnnoucementsMap[this.annoucement['id']];

  this.peering.ui.writeLine('[peer:peerClose] called.');
};
