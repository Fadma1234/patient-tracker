const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(isAuthenticated);

// Profile
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);


module.exports = router;