const WebSocket = require('ws');

/**
 * Handles message sending within a room.
 * 
 * @param {object} socket - The WebSocket connection object.
 * @param {object} rooms - An object containing all active rooms on the server.
 * @param {object} parsedMessage - The parsed JSON message received.
 * 
 * @returns {void} This function does not return any value.
 */
function sendMessage(socket, rooms, parsedMessage) {
  const text = (parsedMessage.text) ? parsedMessage.text.toString().trim() : '';

  if (!rooms[socket.roomCode]) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'You must enter a room to send a message.'
      }));
    }

    return;
  }

  if (text) {
    const date = new Date();

    const options = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const formattedTime = new Intl.DateTimeFormat('pt-BR', options).format(date);

    rooms[socket.roomCode].clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          sender: socket.user,
          time: formattedTime,
          message: text.replace(/\n/g, '\\n')
        }));
      }
    });
  }
}

module.exports = { sendMessage };