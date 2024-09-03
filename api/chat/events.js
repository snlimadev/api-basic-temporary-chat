const WebSocket = require('ws');
const chatServices = require('./services');

function handleMessage(socket, rooms, message) {
  //#region Handle chat room creation, user joining and message sending
  // Lida com a criação de salas de chat, entrada de usuários e envio de mensagens
  try {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.action) {
      case 'create':
      case 'join':
        chatServices.createOrJoinRoom(socket, rooms, parsedMessage);
        break;

      default:
        if (parsedMessage.text !== undefined) {
          chatServices.sendMessage(socket, rooms, parsedMessage);
        } else {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              error: 'No valid parameters received.'
            }));
          }
        }
        break;
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
}

function handleClose(socket, rooms) {
  chatServices.removeFromRoom(socket, rooms);
}

function handleConnection(socket, rooms) {
  socket.on('message', (message) => {
    handleMessage(socket, rooms, message);
  });

  socket.on('close', () => {
    handleClose(socket, rooms);
  });

  socket.on('error', console.error);
}

module.exports = { handleConnection };