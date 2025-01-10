import express from 'express';  // Import express
import auth from '../middleware/auth.js';  // Import auth middleware
import userController from '../controllers/userController.js';

const router=express.Router();
// GET /api/profile - Get user profile
router.get('/profile', auth, userController.getProfile);

// PUT /api/profile - Update user profile
router.put('/profile', auth, userController.updateProfile);

// PUT /api/profile/password - Update password
router.put('/profile/password', auth, userController.updatePassword);

export default router;