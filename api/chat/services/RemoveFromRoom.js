const WebSocket = require('ws');

//#region Function to remove the user from the room
// Função para remover o usuário da sala
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

    // Delete the room if it's empty
    // Exclui a sala se estiver vazia
    if (rooms[socket.roomCode].clients.size === 0) {
      delete rooms[socket.roomCode];
    }
  }
}
//#endregion

module.exports = { removeFromRoom };