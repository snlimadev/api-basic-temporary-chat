<h2>English</h2>

This WebSocket server for a temporary chat was developed using Node.js and the ws library.

It provides real-time chat functionality, allowing users to create or join chat rooms and exchange messages.

The server enforces unique usernames within rooms and ensures a smooth chat experience.

<h4>Features</h4>

&middot; Create or join chat rooms.
<br/>
&middot; Prevents duplicate usernames within a room.
<br/>
&middot; Handles disconnections and user exits efficiently.
<br/>
&middot; Sends real-time messages to all users in a room.
<br/>
&middot; Timestamps messages for a clear chat history.

<h4>How It Works</h4>

&middot; Users can create or join chat rooms by specifying a room code.
<br/>
&middot; The server ensures rooms are properly managed and handles room creation and user entry.
<br/>
&middot; Users send messages to the server, which broadcasts them to all users in the same room.
<br/>
&middot; The server maintains a clean chat experience by preventing username conflicts and updating chat history with timestamps.

<h4>JSON Parameters</h4>

&middot; action: Specify 'create' to create a new room or 'join' to enter an existing room.
<br/>
&middot; roomCode: Unique code for the chat room.
<br/>
&middot; user: The client's chosen username.
<br/>
&middot; maxClients: Maximum number of users allowed in the room.
<br/>
&middot; text: The message text to send.

<h4>JSON Response</h4>

&middot; sender: The user who sent the message.
<br/>
&middot; time: The time the message was sent.
<br/>
&middot; message: The message sent by the user.
<br/>
&middot; event: Alert when a user joins/leaves the room.
<br/>
&middot; error: The error message if it occurs.

<h4>WebSocket Connection URL</h4>

wss://api-basic-temporary-chat.glitch.me

<h2>Português</h2>

Este servidor via WebSocket para um chat temporário foi desenvolvido com Node.js e a biblioteca ws.

Ele fornece funcionalidade de chat em tempo real, permitindo que os usuários criem ou entrem em salas de chat e troquem mensagens.

O servidor garante nomes de usuário exclusivos dentro das salas e oferece uma experiência de chat fluida.

<h4>Funcionalidades</h4>

&middot; Criar ou entrar em salas de chat.
<br/>
&middot; Impedir nomes de usuário duplicados dentro de uma sala.
<br/>
&middot; Lidar com desconexões e saídas de usuários de forma eficaz.
<br/>
&middot; Enviar mensagens em tempo real para todos os usuários em uma sala.
<br/>
&middot; Registrar o horário de envio das mensagens para tornar o histórico do chat mais claro.

<h4>Como Funciona</h4>

&middot; Os usuários podem criar ou entrar em salas de chat especificando um código de sala.
<br/>
&middot; O servidor garante o gerenciamento adequado das salas e lida com a criação de salas e a entrada de usuários.
<br/>
&middot; Os usuários enviam mensagens para o servidor, que as retransmite para todos os usuários na mesma sala.
<br/>
&middot; O servidor mantém uma experiência de chat limpa, evitando conflitos de nomes de usuário e atualizando o histórico do chat com o horário de envio das mensagens.

<h4>Parâmetros no Formato JSON</h4>

&middot; action: Especifique 'create' para criar uma nova sala ou 'join' para entrar em uma sala existente.
<br/>
&middot; roomCode: Código único da sala de chat.
<br/>
&middot; user: O nome de usuário escolhido pelo cliente.
<br/>
&middot; maxClients: Número máximo de usuários permitidos na sala.
<br/>
&middot; text: O texto da mensagem a ser enviada.

<h4>Resposta no Formato JSON</h4>

&middot; sender: O usuário que enviou a mensagem.
<br/>
&middot; time: O horário em que a mensagem foi enviada.
<br/>
&middot; message: A mensagem enviada pelo usuário.
<br/>
&middot; event: Alerta quando um usuário entra/sai da sala.
<br/>
&middot; error: A mensagem de erro, se ocorrer.

<h4>URL de Conexão WebSocket</h4>

wss://api-basic-temporary-chat.glitch.me