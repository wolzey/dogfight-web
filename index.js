const express = require('express')
const app     = express()
const config  = require('./config')
const server  = require('http').Server(app)
const io      = require('socket.io').listen(server)

require('./config/socket')(io)

server.listen(config.port)

app.use(express.static(__dirname + '/game'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
