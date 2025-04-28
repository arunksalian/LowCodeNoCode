const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templates');
const auth = require('../middleware/auth');

// Get all templates (public and user's private templates)
router.get('/', templatesController.getTemplates);

// Get a single template
router.get('/:id', templatesController.getTemplate);

// Create a new template
router.post('/', auth, templatesController.createTemplate);

// Update a template
router.put('/:id', auth, templatesController.updateTemplate);

// Delete a template
router.delete('/:id', auth, templatesController.deleteTemplate);

// Get user's templates
router.get('/user/templates', templatesController.getUserTemplates);

// Get public templates
router.get('/public/templates', templatesController.getPublicTemplates);

module.exports = router; 