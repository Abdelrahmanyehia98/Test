const express = require('express');
const Property = require('../models/property.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Property (Users Only)
router.post('/Properties', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Only users can create properties' });
    }

    const property = new Property({
      ...req.body,
      createdBy: req.user.userId,
    });

    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while creating property' });
  }
});

// Get All Properties
router.get('/Properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching properties' });
  }
});

// Delete Property (Admins Only)
router.delete('/Properties/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete properties' });
    }

    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while deleting property' });
  }
});

module.exports = router;
