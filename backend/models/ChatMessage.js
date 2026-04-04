const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  suggestedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WardrobeItem'
  }],
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
