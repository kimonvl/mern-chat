const mongoose = require('mongoose');
// Conversation Schema
const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [
            {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            joinedAt: { type: Date, default: Date.now },
            role: { type: String, enum: ["admin", "member"], default: "member" }
            }
        ],
        required: true // Ensure the participants array is not empty
        },
    convType: { type: String, enum: ["group", "direct"], default: "direct" },
    convName: {type: String},
    createdAt: { type: Date, default: Date.now },
    lastMessage: {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        timestamp: { type: Date }
    }
},
{ timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);
module.exports = ConversationModel;