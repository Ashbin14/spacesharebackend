const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// GET /api/profile - Get user profile
router.get('/profile', auth, userController.getProfile);

// PUT /api/profile - Update user profile
router.put('/profile', auth, userController.updateProfile);

// PUT /api/profile/password - Update password
router.put('/profile/password', auth, userController.updatePassword);

module.exports = router;