var Client = {};

Client.socket = io();

Client.askNewPlayer = function(){
  Client.socket.emit('join')
}
