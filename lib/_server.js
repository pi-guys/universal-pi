'use strict';

const express = require('express');
const route = require('../route/route.js');
const errorHandler = require('./error_handler.js');

let server = module.exports = exports = express();

server.use(errorHandler());
server.use('/api', route);

server.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});
