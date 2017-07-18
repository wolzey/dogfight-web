Client = function (game) {
  this.game = game;
}

Client.prototype.socket = io();
