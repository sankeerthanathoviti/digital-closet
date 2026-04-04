const WardrobeItem = require('../models/WardrobeItem');

const getWardrobe = async (req, res) => {
  try {
    const items = await WardrobeItem.find({ userId: req.user.id });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addWardrobeItem = async (req, res) => {
  try {
    const { imageBase64, category, color, pattern, seasons } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const item = await WardrobeItem.create({
      userId: req.user.id,
      imageBase64,
      category,
      color,
      pattern,
      seasons
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateWardrobeItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedItem = await WardrobeItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteWardrobeItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWardrobe, addWardrobeItem, updateWardrobeItem, deleteWardrobeItem };
