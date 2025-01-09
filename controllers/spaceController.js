import { Space } from '../models/space.js';
import fs from 'fs/promises';
import path from 'path';

export const spaceController = {
  createSpace: async (req, res) => {
    try {
      const {
        title,
        location,
        monthlyRent,
        roomType,
        description,
        amenities,
        flatmatePreferences
      } = req.body;

      // Handle file uploads
      const images = req.files.map(file => file.filename);

      const space = new Space({
        user: req.user._id,
        title,
        location,
        monthlyRent,
        roomType,
        description,
        images,
        amenities: JSON.parse(amenities),
        flatmatePreferences: JSON.parse(flatmatePreferences)
      });

      await space.save();
      res.status(201).json(space);
    } catch (error) {
      // Clean up uploaded files if there's an error
      if (req.files) {
        await Promise.all(
          req.files.map(file => 
            fs.unlink(path.join('uploads/spaces', file.filename))
          )
        );
      }
      res.status(400).json({ error: error.message });
    }
  },

  getSpaces: async (req, res) => {
    try {
      const spaces = await Space.find()
        .populate('user', 'firstName lastName')
        .sort({ createdAt: -1 });
      res.json(spaces);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSpaceById: async (req, res) => {
    try {
      const space = await Space.findById(req.params.id)
        .populate('user', 'firstName lastName');
      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }
      res.json(space);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateSpace: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title', 'location', 'monthlyRent', 'roomType',
      'description', 'amenities', 'flatmatePreferences'
    ];

    try {
      const space = await Space.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }

      // Handle new image uploads
      if (req.files?.length) {
        // Delete old images
        await Promise.all(
          space.images.map(image => 
            fs.unlink(path.join('uploads/spaces', image))
          )
        );
        space.images = req.files.map(file => file.filename);
      }

      // Update other fields
      updates.forEach(update => {
        if (allowedUpdates.includes(update)) {
          if (update === 'amenities' || update === 'flatmatePreferences') {
            space[update] = JSON.parse(req.body[update]);
          } else {
            space[update] = req.body[update];
          }
        }
      });

      await space.save();
      res.json(space);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteSpace: async (req, res) => {
    try {
      const space = await Space.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }

      // Delete associated images
      await Promise.all(
        space.images.map(image => 
          fs.unlink(path.join('uploads/spaces', image))
        )
      );

      await space.remove();
      res.json({ message: 'Space deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};