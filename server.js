const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Track clients by their usernames
let clients = {};

app.use(express.static('public'));

// When a client connects
io.on('connection', (socket) => {
    console.log('A user connected');

    // Store the client's socket and username for communication
    socket.on('join', (username) => {
        console.log(`${username} joined`);
        socket.username = username;  // Store the username in the socket object
        clients[username] = socket;  // Save the client socket by username
        socket.emit('joined', `Welcome ${username}!`);

        // Broadcast user joining to others (including admin)
        io.emit('chatMessage', {
            from: 'system',
            message: `${username} has joined the chat`,
        });
    });

    // Handle message from one user to another
    socket.on('sendMessage', (toUser, message) => {
        console.log(`Message from ${socket.username} to ${toUser}: ${message}`);
    
        const sender = socket.username;
    
        // Send message to specific user if provided
        if (toUser && clients[toUser]) {
            clients[toUser].emit('chatMessage', {
                from: sender,
                to: toUser,
                message: message,
            });
        } else {
            // Broadcast to all users
            io.emit('chatMessage', {
                from: sender,
                to: "all",
                message: message,
            });
        }
    
        // Ensure admin gets all user messages (including user-to-user)
        if (clients['admin'] && sender !== 'admin') {
            clients['admin'].emit('chatMessage', {
                from: sender,
                to: toUser || "all",
                message: message,
            });
        }
    });


    // Handle admin sending a message to a specific client
    socket.on('adminReply', (toUser, replyMessage) => {
        console.log(`Admin is replying to ${toUser}: ${replyMessage}`);

        // Send the reply message directly to the client
        if (clients[toUser]) {
            clients[toUser].emit('chatMessage', {
                from: 'admin',
                message: replyMessage,
            });
        }

        // Also send the reply message back to the admin
        if (clients['admin']) {
            clients['admin'].emit('chatMessage', {
                from: 'admin',
                to: toUser,
                message: replyMessage,
            });
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            console.log(`${socket.username} disconnected`);
            delete clients[socket.username];  // Remove the client from the list
            io.emit('chatMessage', {
                from: 'system',
                message: `${socket.username} has left the chat`,
            });
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});