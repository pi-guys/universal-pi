'use strict';

const express = require('express');
const route = require(__dirname + '../route/route.js');

let server = module.exports = exports = express();

server.use('/api', route);

server.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});
