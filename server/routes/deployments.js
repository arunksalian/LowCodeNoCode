const express = require('express');
const router = express.Router();
const deploymentsController = require('../controllers/deployments');
const auth = require('../middleware/auth');

// Deploy a template
router.post('/:templateId/deploy', auth, deploymentsController.deployTemplate);

// Get all deployments for user
router.get('/', auth, deploymentsController.getDeployments);

// Get a specific deployment
router.get('/:id', auth, deploymentsController.getDeployment);

module.exports = router;
