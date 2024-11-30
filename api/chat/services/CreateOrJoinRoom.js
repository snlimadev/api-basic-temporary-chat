const WebSocket = require('ws');

//#region Function to handle chat room creation and user joining / Função para lidar com a criação de salas de chat e entrada de usuários
function createOrJoinRoom(socket, rooms, parsedMessage) {
  const roomCode = (parsedMessage.roomCode !== undefined && parsedMessage.roomCode !== null) ? parsedMessage.roomCode.toString().trim().toUpperCase() : '';
  const user = (parsedMessage.user) ? parsedMessage.user.toString().trim() : '';

  //#region Check if the client is already in a room
  // Verifica se o cliente já está em uma sala
  if (socket.roomCode) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'You are already in a room.'
      }));
    }

    return;
  }
  //#endregion

  //#region Handle room creation / Lida com a criação de salas
  if (rooms[roomCode]) {
    //#region Prevent duplicate room codes / Impede duplicidade de códigos de sala
    if (parsedMessage.action === 'create') {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          error: 'Room already exists. Please try using a different room code.'
        }));
      }

      return;
    }
    //#endregion
  } else {
    //#region Create a new room or prevent user joining an inexistent one / Cria uma nova sala ou impede que o usuário entre em uma que não existe
    if (parsedMessage.action === 'create' && roomCode && user && (parseInt(parsedMessage.maxClients) >= 2 && parseInt(parsedMessage.maxClients) <= 16)) {
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
    //#endregion
  }
  //#endregion

  //#region Validations / Validações
  // Check if the room still doesn't exist after a create attempt / Verifica se a sala ainda não existe após tentar criá-la
  if (!rooms[roomCode]) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'Failed to create room. Required to inform room code and username, and room size must be between 2 and 16.'
      }));
    }

    return;
  }

  // Check if the room is full / Verifica se a sala está lotada
  if (rooms[roomCode].clients.size >= rooms[roomCode].maxClients) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        error: 'Room is full.'
      }));
    }

    return;
  }

  // Check if the username is already in use in the room / Verifica se o nome de usuário já está sendo usado na sala
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

  // Validate and attach room code and user to the socket / Valida e vincula o código da sala e o usuário ao socket
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
  //#endregion

  // Add user to the room / Adiciona o usuário à sala
  rooms[roomCode].clients.add(socket);

  // Send a message about the new user joining the room / Envia uma mensagem avisando que o novo usuário entrou na sala
  rooms[socket.roomCode].clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        event: `${socket.user} joined the room`
      }));
    }
  });
}
//#endregion

module.exports = { createOrJoinRoom };