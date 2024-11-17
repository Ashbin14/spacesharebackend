const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/flatController');


router.get('/properties', propertyController.getAllProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.post('/properties', propertyController.createProperty);
router.put('/properties/:id', propertyController.updateProperty);
router.delete('/properties/:id', propertyController.deleteProperty);
router.get('/properties/filter', propertyController.filterProperties);

module.exports = router;


