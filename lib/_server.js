'use strict';
const express = require('express');
const mongoose = require('mongoose');
mongoose.promise = Promise;

const errorHandler = require('./error_handler.js');

const remoteRouter = require('../route/remote_router.js');
const userRouter = require('../route/user_router.js');

mongoose.connect(process.env.MONGLAB_URI || 'mongodb://localhost/users_dev');

let server = module.exports = exports = express();

server.use(errorHandler());
server.use('/api/remote', remoteRouter);
server.use('/api/user', userRouter);

server.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});
