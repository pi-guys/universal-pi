'use strict';
const socket = require('socket.io-client')('https://universal-pi.herokuapp.com');
const exec = require('child_process').exec;
const lirc = require('lirc_node');
lirc.init();

//if you want to keep logging you might want to move to using https://www.npmjs.com/package/debug

console.log('running app.js');
socket.on('post', (data) => {
  //console.log('on post');
  //console.log('irsend SEND_ONCE ' + data[0] + ' ' + data[1]);
  exec('irsend SEND_ONCE ' + data[0] + ' ' + data[1], (err, stdout, stderr) => {
    //console.log('irsend-ing: ', data);
    if (err) return console.log('err: ', err);
    //console.log('stdout: ', stdout);
    //console.log('stderr: ', stderr);
  });
});