const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', require('./routes/ping.js')); 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});