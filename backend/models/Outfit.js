const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
  userPhotoBase64: { type: String }, // optional photo of user wearing it
  occasion: { type: String },
  season: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Outfit', outfitSchema);
