'use strict';
const app = require('express')();
const mongoose = require('mongoose');
mongoose.promise = Promise;
const server = require('http').Server(app);
const io = require('socket.io')(server);

if (!process.env.APP_SECRET) process.env.APP_SECRET = 'eatsleeppooprepeat';

const errorHandler = require('./error_handler.js');
const AppError = require('../lib/app_error.js');
const Remote = require('../model/remote.js');
const lirc = require('lirc_node');
lirc.init();

const remoteRouter = require('../route/remote_router.js');
const userRouter = require('../route/user_router.js');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/users_dev');

app.use(errorHandler());

app.get('/api/update', (req, res, next) => {
  io.emit('update');
  res.status(200).send('Remotes updated to database.');
  next();
});

app.use('/api/remote/:name/:button', (req, res, next) => {
  let remoteName = req.params.name;
  let remoteButton = req.params.button;
  console.log(req.params.name);
  if (!req.params.name) {
    next(AppError.error400('Invalid remote name.'));
  }
  if (!req.params.button) {
    next(AppError.error400('Invalid button for specified remote.'));
  }
  // Remote.find({
  //   'name': req.params.name
  // }, (err, found) => {
  //   if (!found || found === null) {
  //     return res.sendError(AppError.error400('Remote not found.'));
  //   }
  //   if (!found.indexOf(req.params.button || found.indexOf(req.params.button === null))) {
  //     return res.sendError(AppError.error400('Button not found.'));
  //   }
  // });
  io.emit('post', [remoteName, remoteButton]);
  res.status(200).send('sent ' + remoteButton + ' to ' + remoteName + '.');
  next();
});

app.use('/api/remote', remoteRouter);
app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});

module.exports = exports = server;
