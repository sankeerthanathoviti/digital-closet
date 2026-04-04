const express = require('express');
const router = express.Router();
const { getWishlist, addWishlist, deleteWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWishlist).post(protect, addWishlist);
router.route('/:id').delete(protect, deleteWishlist);

module.exports = router;
