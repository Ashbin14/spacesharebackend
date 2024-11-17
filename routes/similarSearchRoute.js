const express = require('express');
const router = express.Router();
const userController = require('../controllers/smilarSearchController');

router.post('/search', userController.searchUsers);

module.exports = router;
