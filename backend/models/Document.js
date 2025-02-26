const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    _id: String, // Document ID
    content: { type: String, default: "" },
});

module.exports = mongoose.model("Document", DocumentSchema);