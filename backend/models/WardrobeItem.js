const mongoose = require('mongoose');

const wardrobeItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageBase64: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String },
  pattern: { type: String },
  seasons: [{ type: String }],
  usageCount: { type: Number, default: 0 },
  lastWorn: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('WardrobeItem', wardrobeItemSchema);
