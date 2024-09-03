const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const { handleConnection } = require('./events');

const rooms = {};

server.on('connection', (socket) => {
  handleConnection(socket, rooms);
});

server.on('listening', () => {
  console.log(`WebSocket server is running on port ${server.options.port}`);
});