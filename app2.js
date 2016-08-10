'use strict';
const socket = require('socket.io-client')('http://localhost:3000');
const exec = require('child_process').exec;
const Remote = require('../model/remote.js');
const lirc = require('lirc-node');
lirc.init();

socket.on('connection', (req, res) => {
  let remotes = lirc.remotes.name;
  if (!remotes) {
    return res.send('No remotes found on Pi');
  }
  Remote.find({'name': remotes}, (err, list) => {
    if (!list || list === null) {
      remotes.forEach(function(newItem) {
        newItem = new Remote(lirc.remotes[newItem]);
        newItem.save((err, saved) => {
          if (err) return err;
          res.send('Remote ' + saved + ' saved to database.');
        });
      });
    }

    if (err) return err;
    list.forEach(function(item) {
      Remote.findOneAndUpdate({'name': item}, lirc.remotes[item]), (err, updated) => {
        if (err) return err;
        res.send('Remote ' + updated + ' updated in database.');
      };
    });
  });
});

socket.on('time', (data) => {
  console.log('time sent', data);
  return exec('echo ' + data);
});

socket.on('post', (data) => {
  console.log(data);
  exec('irsend SEND_ONCE ' + data[0] + ' ' + data[1], (err, stdout, stderr) => {
    if (err) return console.log('err: ', err);
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  });
});
