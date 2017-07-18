module.exports = function (server, io) {
  server.lastPlayerId = 1;
  io.on('connection', function (socket) {
    socket.emit('spawn', {id: server.lastPlayerId++})
    socket.on('newplayer', function(data) {
      socket.player = {
        id: data.id,
        x:  randomInt(100, 400),
        y: randomInt(100, 400)
      }
      socket.emit('allplayers', getAllPlayers())
      socket.broadcast.emit('newplayer', socket.player)
    })

    socket.on('updateAngle', function (data) {
      console.log(data);
      socket.broadcast.emit('enemyMoved', data)
    })
  })

  function getAllPlayers() {
    let players = []
    Object.keys(io.sockets.connected).forEach(function(socketID){
      let player = io.sockets.connected[socketID].player
      if (player) players.push(player)
    })
    return players
  }

  function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
  }
}
