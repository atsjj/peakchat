export default class Peer {
  get annoucement() {
    return this._annoucement;
  }

  set annoucement(value) {
    if (this._annoucement === null) {
      this.peering.peerAnnoucementsMap[value['id']] = this.id;
      this._annoucement = value;
      this.peering.ui.writeLine('[peer:annoucement(set)] created annoucement.');
    } else {
      if (this._annoucement['id'] === value['id']) {
        this._annoucement = value;
        this.peering.ui.writeLine('[peer:annoucement(set)] updated annoucement.');
      } else {
        this.peering.ui.writeLine('[peer:annoucement(set)] error, `id` mismatch.');
      }
    }
    return this._annoucement;
  }

  constructor(id, peering, socket) {
    this._annoucement = null;

    this.id = id;
    this.peering = peering;
    this.socket = socket;
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
        this.peering.ui.writeLine('[peer:annoucement] is ' + JSON.stringify(this.annoucement));
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
