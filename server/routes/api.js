const express = require('express');
const app = express();

app.use('/product/', require('./product'));

module.exports = app;
