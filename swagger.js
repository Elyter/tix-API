const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API Express',
      version: '1.0.0',
      description: 'Documentation de mon API Express',
    },
  },
  apis: ['./routes/*.js'], // Spécifiez ici le chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
