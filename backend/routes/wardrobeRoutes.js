const express = require('express');
const router = express.Router();
const { getWardrobe, addWardrobeItem, updateWardrobeItem, deleteWardrobeItem } = require('../controllers/wardrobeController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWardrobe).post(protect, addWardrobeItem);
router.route('/:id').put(protect, updateWardrobeItem).delete(protect, deleteWardrobeItem);

module.exports = router;
