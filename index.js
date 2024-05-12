const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger-output.json');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', require('./routes/ping.js'));
app.use('/', require('./routes/register.js'));
app.use('/', require('./routes/userData.js'));
app.use('/', require('./routes/events.js'));
app.use('/', require('./routes/images.js'));
app.use('/', require('./routes/likes.js'));
app.use('/', require('./routes/organizers.js'));
app.use('/', require('./routes/ticket.js'));
app.use('/', require('./routes/stats.js'));
app.use('/', require('./routes/follows.js'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});