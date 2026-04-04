const WishlistItem = require('../models/WishlistItem');

const getWishlist = async (req, res) => {
  try {
    const items = await WishlistItem.find({ userId: req.user.id });
    res.json(items);
  } catch(err) { 
    res.status(500).json({ message: err.message }); 
  }
};

const addWishlist = async (req, res) => {
  try {
    const item = await WishlistItem.create({ userId: req.user.id, ...req.body });
    res.json(item);
  } catch(err) { 
    res.status(500).json({ message: err.message }); 
  }
};

const deleteWishlist = async (req, res) => {
  try {
    await WishlistItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ id: req.params.id });
  } catch(err) { 
    res.status(500).json({ message: err.message }); 
  }
};

module.exports = { getWishlist, addWishlist, deleteWishlist };
