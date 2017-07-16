const express = require('express')
const app     = express()
const config  = require('./config')

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.listen(config.port)
