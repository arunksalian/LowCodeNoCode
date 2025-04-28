const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Template = require('../models/Template');

// Apply authentication middleware to all routes
router.use(auth);

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    console.log('Found templates:', templates);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new template
router.post('/', async (req, res) => {
  try {
    const template = new Template({
      ...req.body,
      createdBy: req.user.id
    });
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single template
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a template
router.put('/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 