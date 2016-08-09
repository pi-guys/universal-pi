'use strict';
const Router = require('express').Router;
const lirc = require('lirc_node');
const AppError = require('../lib/app_error.js');
lirc.init();

let router = module.exports = exports = new Router();

router.get('/all', (req, res) => {
  if (!lirc.remotes.Vizio || lirc.remotes.Vizio === null) {
    console.log('No remotes exist on this server.');
    return res.sendError(AppError.error400('No remotes found.'));
  }
  return res.status(200).json(lirc.remotes);
});

router.get('/:name', (req, res) => {
  console.log(lirc.remotes[req.params.remote]);
  if (!req.params.name || req.params.name === null) {
    return res.sendError(AppError.error400('Remote does not yet exist on server.'));
  }
  if (lirc.remotes[req.params.remote] === undefined || null) {
    return res.sendError(AppError.error400('No remote found with that name.'));
  }
  return res.status(200).json(lirc.remotes[req.params.remote]);
});

router.post('/:name/:button', (req, res) => {
  if (!req.params.name) {
    return res.sendError(AppError.error400('Invalid remote name.'));
  }
  if (req.params.name !== lirc.remotes[req.params.name]) {
    return res.sendError(AppError.error400('Remote not found.'));
  }
  if (!lirc.remotes[req.params.name].indexOf(req.params.button)) {
    return res.sendError(AppError.error400('Button not found.'));
  }
  if (!req.params.button) {
    return res.sendError(AppError.error400('Invalid button for specified remote.'));
  }
  lirc.irsend.send_once(req.params.name, req.params.button, () => {
    console.log('sent ' + req.params.button + ' to ' + req.params.name + '.');
    return res.status(200).send('sent ' + req.params.button + ' to ' + req.params.name + '.');
  });
});

router.all((req, res, next) => {
  next(AppError.error404('Please specify a remote to use by setting your endpoint to "/api/remote/remote-name".'));
});
