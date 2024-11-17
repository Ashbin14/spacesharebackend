const express = require('express');
const router = express.Router();
const formInputController = require('../controllers/formInputController');

router.post('/calculate-personality', formInputController.calculatePersonality);

module.exports = router;
