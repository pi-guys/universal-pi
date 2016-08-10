'use strict';
const app = require('express')();
if (!process.env.APP_SECRET) process.env.APP_SECRET = 'poop';
const mongoose = require('mongoose');
mongoose.promise = Promise;
const server = require('http').Server(app);
const io = require('socket.io')(server);

const errorHandler = require('./error_handler.js');

const remoteRouter = require('../route/remote_router.js');
const userRouter = require('../route/user_router.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users_dev');

app.use(errorHandler());

app.use('/api/remote/:name/:button', (req, res, next) => {
  io.emit('post', [req.params.name, req.params.button]);
  next();
});

app.use('/api/remote', remoteRouter);
app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});

module.exports = server;
