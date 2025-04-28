const router = require('express').Router();
const Component = require('../models/Component');

/**
 * @swagger
 * /api/components:
 *   get:
 *     summary: Get all components
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: List of all components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const components = await Component.find();
        res.json(components);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/components:
 *   post:
 *     summary: Create a new component
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       201:
 *         description: Component created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: Invalid request
 */
router.post('/', async (req, res) => {
    const component = new Component({
        type: req.body.type,
        properties: req.body.properties,
        position: req.body.position
    });

    try {
        const newComponent = await component.save();
        res.status(201).json(newComponent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/components/{id}:
 *   patch:
 *     summary: Update a component
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: Component updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: Invalid request
 */
router.patch('/:id', async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);
        if (req.body.type) component.type = req.body.type;
        if (req.body.properties) component.properties = req.body.properties;
        if (req.body.position) component.position = req.body.position;
        
        const updatedComponent = await component.save();
        res.json(updatedComponent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     summary: Delete a component
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *     responses:
 *       200:
 *         description: Component deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        await Component.findByIdAndDelete(req.params.id);
        res.json({ message: 'Component deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
