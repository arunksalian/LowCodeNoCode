const express = require('express');
const router = express.Router();
const dataSourceController = require('../controllers/dataSourceController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Get all data sources
router.get('/', dataSourceController.getAllDataSources);

// Create a new data source
router.post('/', dataSourceController.createDataSource);

// Update a data source
router.put('/:id', dataSourceController.updateDataSource);

// Delete a data source
router.delete('/:id', dataSourceController.deleteDataSource);

// Test data source connection
router.post('/test', dataSourceController.testConnection);

// Execute query on data source
router.post('/:id/execute', dataSourceController.executeQuery);

module.exports = router; 