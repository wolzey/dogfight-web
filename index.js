const express = require('express')
const app     = express()
const config  = require('./config')
const server  = require('http').Server(app)
const io      = require('socket.io').listen(server)

require('./config/socket')(server, io)

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

server.listen(config.port)
