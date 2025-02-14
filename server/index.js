const express = require('express')
const ws = require('ws')

const app = express()
const port = 8080

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => {
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                setTimeout(() => {
                    client.send(
                        Buffer.from(JSON.stringify({ 'source': 'server', 'content': 'response from server' })),
                        { binary: false });
                }, 1000);
            }
        });
        console.log(message.toString());       
    });
});

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
