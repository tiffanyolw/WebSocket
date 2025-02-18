const express = require('express')
const ws = require('ws')

const app = express()
const port = 8080


const items = {
    'Item1': {'price': 100, 'amount': 1000},
    'Item2': {'price': 2800, 'amount': 500},
    'Item3': {'price': 700, 'amount': 600}
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

var intervals = {}
const wss = new ws.Server({ noServer: true });
wss.on('connection', socket => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
            intervals[client] = setInterval(timeout => {
                for (let item in items) {
                    items[item]['price'] += rand(-10, 10);
                    items[item]['amount'] += Math.floor(rand(-100, 100));
                    client.send(JSON.stringify({
                        'item': item,
                        'price': items[item]['price'],
                        'amount': items[item]['amount']
                    }));
                }
            }, 2000); // every 2 seconds

            /*var count = 0;
            setInterval(timeout => {
                count ++;
                message = { 'source': 'server', 'content': `response from server: ${count}` };
                client.send(
                    Buffer.from(JSON.stringify(message)),
                    { binary: false }
                );
                console.log(JSON.stringify(message));
            }, 5000);*/
        }
    });
});

wss.on('close', socket => {
    intervals.forEach(interval => {
        clearInterval(interval)
    });
});

wss.on('error', console.error);

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});
