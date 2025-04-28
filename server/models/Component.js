const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Component:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           description: The type of the component
 *         properties:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           description: Key-value pairs of component properties
 *         position:
 *           type: object
 *           properties:
 *             x:
 *               type: number
 *               description: X coordinate of the component
 *             y:
 *               type: number
 *               description: Y coordinate of the component
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the component was created
 */

const ComponentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    properties: {
        type: Map,
        of: String,
        default: {}
    },
    position: {
        x: Number,
        y: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Component', ComponentSchema);
