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
  if (lirc.remotes[req.params.remote] === undefined || lirc.remotes[req.params.remote] === null) {
    return res.sendError(AppError.error400('No remote found with that name.'));
  }
  return res.status(200).json(lirc.remotes[req.params.remote]);
});

router.all((req, res, next) => {
  next(AppError.error404('Please specify a remote to use by setting your endpoint to "/api/remote/remote-name".'));
});

router.all('/:name', (req,res,next)=>{
  next(AppError.error404('Please specify a button for remote: ' + req.params.name + ', by setting your endpoint to "api/' + req.params.name + '/button-name".'));
});
