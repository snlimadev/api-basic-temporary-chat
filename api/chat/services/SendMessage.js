const WebSocket = require('ws');

//#region Function to handle message sending within a room / Função para lidar com o envio de mensagens dentro de uma sala
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
    rooms[socket.roomCode].clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Format time / Formata a hora
        const date = new Date();
        const timeZone = 'America/Sao_Paulo';
        const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedTime = new Intl.DateTimeFormat('pt-BR', options).format(date);

        // Send the message to all users in the room / Envia a mensagem a todos os usuários da sala
        client.send(JSON.stringify({
          sender: socket.user,
          time: formattedTime,
          message: text.replace(/\n/g, '\\n')
        }));
      }
    });
  }
}
//#endregion

module.exports = { sendMessage };