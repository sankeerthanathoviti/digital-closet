const express = require('express');
const router = express.Router();
const { analyzeImage, chatStylist, getChatHistory, getChatSessions, planTrip, gapDetection, searchWardrobe, deleteChatSession } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeImage);
router.get('/chat/sessions', protect, getChatSessions);
router.delete('/chat/sessions/:sessionId', protect, deleteChatSession);
router.post('/chat', protect, chatStylist);
router.get('/chat/:sessionId', protect, getChatHistory);
router.post('/packing', protect, planTrip);
router.post('/gap-detection', protect, gapDetection);
router.post('/search', protect, searchWardrobe);

module.exports = router;
