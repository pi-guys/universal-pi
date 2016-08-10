'use strict';
const app = require('express')();
const mongoose = require('mongoose');
mongoose.promise = Promise;
const server = require('http').Server(app);
const io = require('socket.io')(server);

const errorHandler = require('./error_handler.js');
const AppError = require('../lib/app_error.js');
const Remote = require('../model/remote.js');
const lirc = require('lirc-node');
lirc.init();

const remoteRouter = require('../route/remote_router.js');
const userRouter = require('../route/user_router.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users_dev');

app.use(errorHandler());

app.use('/api/remote/:name/:button', (req, res, next) => {
  if (!req.params.name) {
    return res.sendError(AppError.error400('Invalid remote name.'));
  }
  if (!req.params.button) {
    return res.sendError(AppError.error400('Invalid button for specified remote.'));
  }
  Remote.find({'name': req.params.name}, (err, found) => {
    if (!found || found === null) {
      return res.sendError(AppError.error400('Remote not found.'));
    }
    if (!found.indexOf(req.params.button || found.indexOf(req.params.button === null))){
      return res.sendError(AppError.error400('Button not found.'));
    }
  });
  io.emit('post', [req.params.name, req.params.button]);
  next();
  return res.status(200).send('sent ' + req.params.button + ' to ' + req.params.name + '.');
});

app.use('/api/remote', remoteRouter);
app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});

server.listen(3000, () => console.log('hello from the server'));
