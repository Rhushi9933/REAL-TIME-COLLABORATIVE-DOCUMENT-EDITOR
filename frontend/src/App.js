import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

const socket = io("http://localhost:5000");

function App() {
    const [text, setText] = useState("");
    const [docId, setDocId] = useState(localStorage.getItem("docId") || uuidV4());

    useEffect(() => {
    console.log("📡 Connecting to WebSocket...");
    socket.emit("get-document", docId);

    socket.on("load-document", (content) => {
        console.log("📄 Document loaded:", content);
        setText(content);
    });

    socket.on("update-document", (content) => {
        console.log("🔄 Document updated:", content);
        setText(content);
    });

    return () => socket.disconnect();
}, [docId]);

    const handleChange = (e) => {
        setText(e.target.value);
        socket.emit("edit-document", { docId, content: e.target.value });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Real-Time Collaborative Document Editor</h2>
            <textarea
                value={text}
                onChange={handleChange}
                rows="10"
                cols="50"
                style={{ width: "80%", height: "300px" }}
            />
        </div>
    );
}

export default App;