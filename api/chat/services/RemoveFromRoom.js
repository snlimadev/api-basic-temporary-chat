const WebSocket = require('ws');

/**
 * Removes the user from their room, then deletes the room if it becomes empty.
 * 
 * @param {object} socket - The WebSocket connection object.
 * @param {object} rooms - An object containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
function removeFromRoom(socket, rooms) {
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
}

module.exports = { removeFromRoom };