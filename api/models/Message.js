const mongoose = require('mongoose');
  
// Message Schema
const MessageSchema = new mongoose.Schema(
{
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    attachments: [
    {
        type: { type: String, enum: ["image", "video", "file", "audio"], required: true },
        url: { type: String, required: true }
    }
    ],
    status: {
    type: Map, // Key-value pair for read/delivered status by each participant
    of: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
    },
    reactions: [
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reaction: { type: String } // e.g., emoji like 👍, ❤️, etc.
    }
    ],
    timestamp: { type: Date, default: Date.now }
},
{ timestamps: true }
);

// Create Index for conversationId to optimize queries
MessageSchema.index({ conversationId: 1, timestamp: 1 });

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;