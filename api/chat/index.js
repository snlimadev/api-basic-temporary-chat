const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const rooms = {};

const chatFunctions = require('./services');

server.on('connection', (socket) => {
  socket.on('message', (message) => {
    //#region Handle chat room creation, user joining and message sending
    // Lida com a criação de salas de chat, entrada de usuários e envio de mensagens
    try {
      const parsedMessage = JSON.parse(message);

      if (!parsedMessage.action && parsedMessage.text === undefined) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            error: 'No valid parameters received.'
          }));
        }

        return;
      }

      if (parsedMessage.action === 'create' || parsedMessage.action === 'join') {
        chatFunctions.createOrJoinRoom(socket, rooms, parsedMessage);
      } else {
        chatFunctions.sendMessage(socket, rooms, parsedMessage);
      }
    } catch (error) {
      console.error('Error processing message: ', error);

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          error: 'Invalid JSON message received.'
        }));
      }
    }
    //#endregion
  });

  socket.on('close', () => {
    //#region Handle client disconnection
    // Lida com desconexões do cliente
    if (rooms[socket.roomCode]) {
      rooms[socket.roomCode].clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            event: `${socket.user} left the room`
          }));
        }
      });

      rooms[socket.roomCode].clients.delete(socket);

      if (rooms[socket.roomCode].clients.size === 0) {
        delete rooms[socket.roomCode];
      }
    }
    //#endregion
  });

  socket.on('error', console.error);
});

server.on('listening', () => {
  console.log(`WebSocket server is running on port ${server.options.port}`);
});