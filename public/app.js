const socket = io();

// Join the chat when the user enters a username
document.getElementById('join-btn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  if (username) {
    socket.emit('join', username);  // Join the chat with the username
    document.getElementById('chat-box').style.display = 'block';
    document.getElementById('username').disabled = true;
    document.getElementById('join-btn').disabled = true;
  } else {
    alert('Please enter a username');
  }
});

// Send message to another user
document.getElementById('send-btn').addEventListener('click', () => {
  const toUser = document.getElementById('to-user').value;
  const message = document.getElementById('message').value;
  if (toUser && message.trim()) {
    socket.emit('sendMessage', toUser, message);  // Send message to another user

    // Display the message in the sender's chat box with recipient info
    const messageElement = document.createElement('li');
    messageElement.classList.add('sent');
    messageElement.textContent = `You to ${toUser}: ${message}`;
    document.getElementById('messages').appendChild(messageElement);

    document.getElementById('message').value = '';  // Clear the message input
  } else {
    alert('Please provide both recipient username and message');
  }
});

// Receive messages (from other users or admin)
socket.on('chatMessage', (msg) => {
  const messageElement = document.createElement('li');
  if (msg.from === 'admin') {
    messageElement.classList.add('received');
    messageElement.textContent = `admin: ${msg.message}`;  // Messages from admin
  } else {
    messageElement.classList.add('received');
    messageElement.textContent = `${msg.from}: ${msg.message}`;  // Messages from other users
  }
  document.getElementById('messages').appendChild(messageElement);
});

