const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { analyzeImage, chatStylist, getChatHistory, getChatSessions, planTrip, gapDetection, searchWardrobe } = require('../controllers/aiController');
>>>>>>> neworigin/main
router.post('/analyze', protect, analyzeImage);
router.get('/chat/sessions', protect, getChatSessions);
<<<<<<< HEAD
router.delete('/chat/sessions/:sessionId', protect, deleteChatSession);
=======
=======
const { analyzeImage, chatStylist, getChatHistory, getChatSessions, planTrip, gapDetection, searchWardrobe, deleteChatSession } = require('../controllers/aiController');

router.post('/analyze', protect, analyzeImage);
router.get('/chat/sessions', protect, getChatSessions);
router.delete('/chat/sessions/:sessionId', protect, deleteChatSession);
=======
const { analyzeImage, chatStylist, getChatHistory, getChatSessions, planTrip, gapDetection, searchWardrobe } = require('../controllers/aiController');
>>>>>>> neworigin/main
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeImage);
router.get('/chat/sessions', protect, getChatSessions);
<<<<<<< HEAD
router.delete('/chat/sessions/:sessionId', protect, deleteChatSession);
=======
>>>>>>> neworigin/main
router.post('/chat', protect, chatStylist);
router.get('/chat/:sessionId', protect, getChatHistory);
router.post('/packing', protect, planTrip);
router.post('/gap-detection', protect, gapDetection);
router.post('/search', protect, searchWardrobe);

module.exports = router;
