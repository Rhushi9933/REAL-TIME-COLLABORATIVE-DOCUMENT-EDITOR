const socket = io();

// Join as admin
socket.emit('join', 'admin');

// Handle sending reply to a specific client
document.getElementById('send-reply').addEventListener('click', () => {
  const clientUsername = document.getElementById('reply-to').value;
  const replyMessage = document.getElementById('admin-reply').value;

  if (clientUsername && replyMessage.trim()) {
    socket.emit('adminReply', clientUsername, replyMessage);  // Send reply to the client
    document.getElementById('admin-reply').value = '';  // Clear the reply input
  } else {
    alert('Please provide both client username and message');
  }
});

// Receive all messages (from users, system, and admin)

socket.on('chatMessage', (msg) => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('message');

  if (msg.from.toLowerCase() === 'admin') {
    // Admin's own messages → Right side
    messageElement.classList.add('sent');
    messageElement.textContent = `You to ${msg.to}: ${msg.message}`;
  } else {
    // User messages → Left side (Only show username and message)
      messageElement.classList.add('received');
        if (msg.to) {
          messageElement.textContent = `${msg.from} to ${msg.to}: ${msg.message}`;
        } else {
            messageElement.textContent = `${msg.from}: ${msg.message}`;
        }
  }
  document.getElementById('messages').appendChild(messageElement);
});


