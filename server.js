const express = require('express');
const cors = require('cors');
const router = require('./api/routes/index');
const { logErrors, clientError404Handler, clientError500Handler, errorHandler} = require('./api/utils/error')


const app = express()

app.use(express.json());

app.use(cors());

app.use(router);

// Catch errors
app.use(logErrors);
app.use(clientError404Handler);
app.use(clientError500Handler);
app.use(errorHandler);

app.listen(process.env.PORT);
