const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/postFetchController');
router.get('/profile/:userId', userProfileController.getUserProfile);

module.exports = router;
