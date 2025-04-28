const express = require('express');
const router = express.Router();
const workspacesController = require('../controllers/workspaces');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all workspaces
router.get('/', workspacesController.getWorkspaces);

// Get a single workspace
router.get('/:id', workspacesController.getWorkspace);

// Create a new workspace
router.post('/', workspacesController.createWorkspace);

// Update a workspace
router.put('/:id', workspacesController.updateWorkspace);

// Delete a workspace
router.delete('/:id', workspacesController.deleteWorkspace);

// Add a template to a workspace
router.post('/:id/templates', workspacesController.addTemplate);

// Remove a template from a workspace
router.delete('/:id/templates/:templateId', workspacesController.removeTemplate);

module.exports = router; 