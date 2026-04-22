const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  weather: { type: String },
  occasion: { type: String },
  packingPlan: {
    summary: String,
    tops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    bottoms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    outerwear: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    shoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }]
  }
}, { timestamps: true });

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
