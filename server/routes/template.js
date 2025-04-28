const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/template');

// All routes require authentication
router.use(auth);

// Create a new template
router.post('/', createTemplate);

// Get all templates for the current user
router.get('/', getTemplates);

// Get a single template
router.get('/:id', getTemplate);

// Update a template
router.put('/:id', updateTemplate);

// Delete a template
router.delete('/:id', deleteTemplate);

module.exports = router;
