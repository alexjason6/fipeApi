const express = require('express');
require('express-async-errors');

const cors = require('./src/app/middlewares/cors');
const errorHandler = require('./src/app/middlewares/errorHandler');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT,  () => {
  console.log('API FIPE - Servidor rodando.');
});