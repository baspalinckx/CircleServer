const express = require('express');
const app = express();
const routes = express.Router();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);

const port = process.env.PORT || 4000;


io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
        io.emit('new-message', message);
        console.log(message);
    });
});


server.listen(port, () => {
    console.log(`Chat server running fine on: ${port}`);
});

module.exports = routes;
