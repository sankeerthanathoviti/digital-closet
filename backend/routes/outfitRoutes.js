const express = require('express');
const router = express.Router();
const { getOutfits, saveOutfit, deleteOutfit } = require('../controllers/outfitController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getOutfits).post(protect, saveOutfit);
router.route('/:id').delete(protect, deleteOutfit);

module.exports = router;
