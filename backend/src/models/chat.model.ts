import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatType: { type: String, enum: ['openai', 'ollama'], required: true },
  userMessage: { type: String, required: true },
  botReply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('chats', chatSchema);
