const Property = require('../models/flatModel');

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    res.status(201).json({
      success: true,
      data: newProperty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a property by ID
exports.updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
    res.status(200).json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a property by ID
exports.deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.filterProperties = async (req, res) => {
    try {
      // Create a query object to store filters
      const queryObj = {};
  
      // Filtering based on query parameters
      if (req.query.bathrooms) {
        queryObj.bathrooms = req.query.bathrooms;
      }
  
      if (req.query.bedrooms) {
        queryObj.bedrooms = req.query.bedrooms;
      }
  
      if (req.query.parking) {
        queryObj.parking = req.query.parking;
      }
  
      
  
      // Filtering based on location (latitude and longitude with a range)
      if (req.query.latitude && req.query.longitude && req.query.radius) {
        const { latitude, longitude, radius } = req.query;
  
        // Using MongoDB's geospatial query
        queryObj.location = {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(longitude), parseFloat(latitude)],
              parseFloat(radius) / 6378.1, // Radius in radians (Earth's radius in kilometers)
            ],
          },
        };
      }
  
      // Execute the query with filters
      const filteredProperties = await Property.find(queryObj);
  
      res.status(200).json({
        success: true,
        data: filteredProperties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
