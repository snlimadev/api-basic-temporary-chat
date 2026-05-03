const WebSocket = require('ws');

/**
 * Handles chat room creation and user joining.
 * 
 * @param {object} socket - The WebSocket connection object.
 * @param {object} rooms - An object containing all active rooms on the server.
 * @param {object} parsedMessage - The parsed JSON message received.
 * 
 * @returns {void} This function does not return any value.
 */
function createOrJoinRoom(socket, rooms, parsedMessage) {
  const roomCode = (parsedMessage.roomCode !== undefined && parsedMessage.roomCode !== null)
    ? parsedMessage.roomCode.toString().trim().toUpperCase()
    : '';

  const user = (parsedMessage.user) ? parsedMessage.user.toString().trim() : '';

  if (socket.roomCode) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'You are already in a room.'
      }));
    }

    return;
  }

  if (rooms[roomCode]) {
    if (parsedMessage.action === 'create') {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          error: 'Room already exists. Please try using a different room code.'
        }));
      }

      return;
    }
  } else {
    if (
      parsedMessage.action === 'create' && roomCode && user &&
      (parseInt(parsedMessage.maxClients) >= 2 && parseInt(parsedMessage.maxClients) <= 16)
    ) {
      rooms[roomCode] = {
        clients: new Set(),
        maxClients: parseInt(parsedMessage.maxClients)
      };
    } else if (parsedMessage.action === 'join') {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          error: 'Room does not exist.'
        }));
      }

      return;
    }
  }

  if (!rooms[roomCode]) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'Failed to create room. ' +
          'Required to inform room code and username, and room size must be between 2 and 16.'
      }));
    }

    return;
  }

  if (rooms[roomCode].clients.size >= rooms[roomCode].maxClients) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'Room is full.'
      }));
    }

    return;
  }

  for (const client of rooms[roomCode].clients) {
    if (client !== socket && client.user.toUpperCase() === user.toUpperCase()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          error: 'Username is already in use in this room.'
        }));
      }

      return;
    }
  }

  if (roomCode && user) {
    socket.roomCode = roomCode;
    socket.user = user;
  } else {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'Required to inform room code and username.'
      }));
    }

    return;
  }

  rooms[roomCode].clients.add(socket);

  rooms[socket.roomCode].clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        event: `${socket.user} joined the room`
      }));
    }
  });
}

module.exports = { createOrJoinRoom };