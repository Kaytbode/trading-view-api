const express = require('express');
const router = require('./api/routes/index');
const app = express()
const cors = require('cors');

app.use(express.json());

app.use(cors());

app.use(router);

app.listen(process.env.PORT);
