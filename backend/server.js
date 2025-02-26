require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const Document = require("./models/Document");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB (Local)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB (Local) Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// WebSocket Handling
io.on("connection", (socket) => {
    console.log("🔵 New user connected:", socket.id);

    socket.on("get-document", async (docId) => {
        console.log(`📄 User requested document: ${docId}`);
        const document = await Document.findById(docId) || new Document({ _id: docId, content: "" });
        socket.join(docId);
        socket.emit("load-document", document.content);
    });

    socket.on("edit-document", async ({ docId, content }) => {
        console.log(`✏️ Editing document ${docId}: ${content}`);
        await Document.findByIdAndUpdate(docId, { content });
        socket.to(docId).emit("update-document", content);
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected");
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));