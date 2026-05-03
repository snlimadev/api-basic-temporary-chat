const WebSocket = require('ws');
const chatServices = require('./services');

/**
 * Handles the WebSocket `message` event by calling services for chat room
 * creation, user joining, and message sending.
 * 
 * @param {object} socket - The WebSocket connection object.
 * @param {object} rooms - An object containing all active rooms on the server.
 * @param {string} message - The incoming message as a JSON string.
 * 
 * @returns {void} This function does not return any value.
 */
function handleMessage(socket, rooms, message) {
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
              error: 'Invalid request.'
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
}

/**
 * Handles the WebSocket `close` event by calling the service for removing the
 * user from their room.
 * 
 * @param {object} socket - The WebSocket connection object.
 * @param {object} rooms - An object containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
function handleClose(socket, rooms) {
  chatServices.removeFromRoom(socket, rooms);
}

/**
 * Handles the WebSocket `connection` event by setting up event listeners for
 * the `message`, `close`, and `error` events.
 * 
 * @param {object} socket - The WebSocket connection object.
 * @param {object} rooms - An object containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
function handleConnection(socket, rooms) {
  socket.on('message', (message) => {
    try {
      handleMessage(socket, rooms, message);
    } catch (error) {
      console.error('Error handling message event: ', error);
    }
  });

  socket.on('close', () => {
    try {
      handleClose(socket, rooms);
    } catch (error) {
      console.error('Error handling close event: ', error);
    }
  });

  socket.on('error', console.error);
}

module.exports = { handleConnection };