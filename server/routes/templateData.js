const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const templateDataController = require('../controllers/templateDataController');

/**
 * @swagger
 * /api/template-data:
 *   post:
 *     summary: Create new template data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *               - name
 *               - data
 *             properties:
 *               templateId:
 *                 type: string
 *               name:
 *                 type: string
 *               data:
 *                 type: array
 */
router.post('/', auth, templateDataController.createTemplateData);

/**
 * @swagger
 * /api/template-data/{id}:
 *   get:
 *     summary: Get template data by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', auth, templateDataController.getTemplateData);

/**
 * @swagger
 * /api/template-data/template/{templateId}:
 *   get:
 *     summary: Get all template data for a specific template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.get('/template/:templateId', auth, templateDataController.getAllTemplateData);

/**
 * @swagger
 * /api/template-data/{id}:
 *   put:
 *     summary: Update template data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *               status:
 *                 type: string
 */
router.put('/:id', auth, templateDataController.updateTemplateData);

/**
 * @swagger
 * /api/template-data/{id}:
 *   delete:
 *     summary: Delete template data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', auth, templateDataController.deleteTemplateData);

module.exports = router;
