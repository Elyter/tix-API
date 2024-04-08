const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', require('./routes/ping.js'));
app.use('/', require('./routes/register.js'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});