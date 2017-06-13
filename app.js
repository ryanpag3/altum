var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    socket.on('test', function(){
        console.log('test called');
        io.emit('test', {
            message:'test message'
            }
        )
    });
});

server.listen(3000, function(){
    console.log('server running on port 3000');
});
