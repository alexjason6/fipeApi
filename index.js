const express = require('express');
require('express-async-errors');

const cors = require('./src/app/middlewares/cors');
const errorHandler = require('./src/app/middlewares/errorHandler');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler)

app.listen(3000,  () => console.log('Rodou'));