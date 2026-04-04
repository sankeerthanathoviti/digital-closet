const Outfit = require('../models/Outfit');

const getOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find({ userId: req.user.id }).populate('items');
    res.status(200).json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveOutfit = async (req, res) => {
  try {
    const { name, items, userPhotoBase64, occasion, season } = req.body;
    const newOutfit = await Outfit.create({
      userId: req.user.id,
      name,
      items,
      userPhotoBase64,
      occasion,
      season
    });
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    if (outfit.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await outfit.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOutfits, saveOutfit, deleteOutfit };
