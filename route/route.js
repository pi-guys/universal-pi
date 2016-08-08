'use strict';

const Router = require('express').Router;
const lirc = require('lirc_node');
const AppError = require('../lib/app_error.js');
lirc.init();

let router = module.exports = exports = new Router();

router.get('/all', (req, res) => {
  // if(lirc.remotes === { 'irsend: command not found': [ 'found' ] }){
  //   console.log('No remotes exist on server.');
  //   return res.sendError(AppError.error400('No remotes exist on server.'));
  // }
  console.log(lirc.remotes);
  return res.status(200).json(lirc.remotes);
});

router.get('/:remote', (req, res) => {
  if (!req.params.remote) {
    return res.sendError(AppError.error400('Remote does not yet exist on server.'));
  }
  console.log(lirc.remotes[req.params.remote]);
  return res.status(200).json(lirc.remotes[req.params.remote]);
});

router.post('/remote/:name/:button', (req, res) => {
  if (!req.params.name) {
    return res.sendError(AppError.error400('Invalid remote name.'));
  } else if (!req.params.button) {
    return res.sendError(AppError.error400('Invalid button for specified remote.'));
  }
  lirc.irsend.send_once(req.params.name, req.params.button, () => {
    console.log('sent ' + req.params.button + ' to ' + req.params.name + '.');
    return res.status(200).send('sent ' + req.params.button + ' to ' + req.params.name + '.');
  });
});

router.all('/', (req, res, next) => {
  next(AppError.error404('Please specify a remote to use by setting your endpoint to "/api/remote-name".'));
});
