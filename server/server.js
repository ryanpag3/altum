const express = require('express');
var app = express();


// setup server
var server = require('http').createServer(app);
// attach sockets.io to http server
var io = require('socket.io')(server);
var socketHandler = require('./utils/socket')(io);

// setup application
require('./app')(app, express, io);

server.listen(3000, function () {
  console.log('server running on port 3000');
});


