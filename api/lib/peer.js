var annoucement = null;

export default class Peer {
  get annoucement() {
    return annoucement;
  }

  set annoucement(value) {
    if (annoucement === null) {
      this.peering.peerAnnoucementsMap[value['id']] = this.id;
      annoucement = value;
    } else {
      if (annoucement['id'] === value['id']) {
        annoucement = value;
      } else {
        this.peering.ui.writeLine('[peer:annoucement(set)] error, `id` mismatch.');
      }
    }
    return annoucement;
  }

  constructor(id, peering, socket) {
    this.id = id;
    this.peering = peering;
    this.socket = socket;

    annoucement = null;
  }

  send(message) {
    var json = JSON.stringify(message);

    this.socket.send(json);

    this.peering.ui.writeLine('[peer:send] sent message to peer@' + this.id);
  }

  message(data /*, flags */) {
    var message = JSON.parse(data);

    switch(message['type']) {
      case 'annoucement':
        this.annoucement = message;
        break;
      case 'offer':
        this.peering.ui.writeLine('[peer:peerHandleOffer] called.');
        break;
    }

    this.peering.ui.writeLine('[peer:peerMessage] called.');
  }

  error(/* error */) {
    this.peering.ui.writeLine('[peer:peerError] called.');
  }

  close(/* code, message */) {
    if (this.annoucement && this.annoucement['id']) {
      this.peering.peerAnnoucementsMap[this.annoucement['id']] = null;
      delete this.peering.peerAnnoucementsMap[this.annoucement['id']];
    }

    this.peering.ui.writeLine('[peer:peerClose] called.');
  }
}
