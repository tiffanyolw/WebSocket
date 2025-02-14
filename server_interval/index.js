const express = require('express')
const ws = require('ws')

const app = express()
const port = 8080

const wsServer = new ws.Server({ noServer: true });
var count = 1;
wsServer.on('connection', socket => {
    wsServer.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
            count = 0;
            setInterval(timeout => {
                count ++;
                message = { 'source': 'server', 'content': `response from server: ${count}` };
                client.send(
                    Buffer.from(JSON.stringify(message)),
                    { binary: false });
                console.log(JSON.stringify(message));
            }, 5000);
        }
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
