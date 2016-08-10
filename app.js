'use strict';
const socket = require('socket.io-client')('http://localhost:3000');
const exec = require('child_process').exec;

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
