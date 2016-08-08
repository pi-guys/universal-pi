'use strict';

const Router = require('express').Router;
const lirc = require('lirc_node');
const AppError = require('../lib/app_error.js');
lirc.init();

let router = module.exports = exports = new Router();

router.get('/all', (req, res) => {
  console.log(lirc.remotes);
  return res.status(200).json(lirc.remotes);
});

router.get('/:remote', (req, res) => {
  console.log(lirc.remotes[req.params.remote]);
  return res.status(200).json(lirc.remotes[req.params.remote]);
});

router.post('/remote/:name/:button', (req, res)=>{
  lirc.irsend.send_once(req.params.name, req.params.button, () => {
    console.log('sent ' + req.params.button + ' to ' + req.params.name + '.');
    return res.status(200).send('sent ' + req.params.button + ' to ' + req.params.name + '.');
  });
});

router.all('/', (req,res)=>{
  return res.status(404).send('Please specify a remote to use by setting your endpoint to "/api/remote-name".');
});
