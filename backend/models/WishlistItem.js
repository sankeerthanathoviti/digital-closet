const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  category: { type: String },
  details: { type: String },
  isAiSuggested: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('WishlistItem', wishlistSchema);
