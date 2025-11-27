const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

// Get all conversations
router.get('/', messageController.getConversations);

// Get conversation with specific user
router.get('/:userId', messageController.getConversation);

// Send message
router.post('/:userId', messageController.sendMessage);

// Mark messages as read
router.post('/:userId/read', messageController.markAsRead);

module.exports = router;