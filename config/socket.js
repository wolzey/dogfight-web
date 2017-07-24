let playerId = 1;
module.exports = function (io) {
  io.on('connection', function (socket) {
    // Assign random position to new player
    // Need to send back this location to the socket to assign to the game
    // Send all players to the socket
    socket.on('join', function() {
      socket.player = {
        id: playerId++,
        x: randomInt(100, 400),
        y: randomInt(100, 400),
        bullets: []
      }

      socket.emit('spawn', socket.player)
      socket.emit('allplayers', getAllPlayers())
      socket.broadcast.emit('newplayer', socket.player)
    })

    socket.on('playerShoot', function(data) {
      if (socket.player.bullets.length >= 3) {
        socket.player.bullets = socket.player.bullets.pop()
        socket.player.bullets.push(data)
      }

      data.id = socket.player.id

      socket.broadcast.emit('enemyShoot', data)
    })

    socket.on('playerMove', function(data) {
      if (!socket.player) {
        return
      }

      socket.broadcast.emit('enemyMove', {
        id: socket.player.id,
        x: data.x,
        y: data.y,
        mouseX: data.mouseX,
        mouseY: data.mouseY,
        angle: data.angle
      })
    })

    socket.on('disconnect',function(){
      if (socket.player) io.emit('remove', socket.player.id)
    });
  })

  function getAllPlayers() {
    let players = []
    Object.keys(io.sockets.connected).forEach(function(socketID) {
      let player = io.sockets.connected[socketID].player;
      if (player) players.push(player);
    });
    return players;
  }

  function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }
}
