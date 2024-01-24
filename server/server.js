const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const apiRouter = require('./routes/api');
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a product
app.use('/api/', apiRouter);

http.createServer(app).listen(3001, () => {
  console.log('Listen on 0.0.0.0:3001');
});

// Gracefully shut down on SIGINT
process.on('SIGINT', function () {
  process.exit();
});
