const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Low Code No Code Platform API',
      version: '1.0.0',
      description: 'API documentation for Low Code No Code Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./server/routes/*.js', './server/models/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options);
