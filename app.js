'use strict';
const socket = require('socket.io-client')('https://universal-pi.herokuapp.com');
const exec = require('child_process').exec;
const Remote = require('./model/remote.js');
const lirc = require('lirc_node');
lirc.init();

console.log('running app.js');

let update = function() {
  console.log('updating remotes');
  let remotes = lirc.remotes.name;
  console.log(remotes);
  if (!remotes) {
    return 'No remotes found on Pi';
  }
  Remote.find({
    'name': remotes
  }, (err, list) => {
    console.log('finding remotes in mongo');
    if (!list || list === null) {
      remotes.forEach(function(newItem) {
        newItem = new Remote(lirc.remotes[newItem]);
        newItem.save((err, saved) => {
          if (err) return err;
          return 'Remote ' + saved + ' saved to database.';
        });
      });
    }

    if (err) return err;
    list.forEach(function(item) {
      Remote.findOneAndUpdate({
        'name': item
      }, lirc.remotes[item]), (err, updated) => {
        if (err) return err;
        return 'Remote ' + updated + ' updated in database.';
      };
    });
  });
};

// update();
//
// socket.on('time', (data) => {
//   console.log('time sent', data);
//   return exec('echo ' + data);
// });

socket.on('post', (data) => {
  console.log('on post');
  exec('irsend SEND_ONCE ' + data[0] + ' ' + data[1], (err, stdout, stderr) => {
    console.log('irsend-ing: ', data);
    if (err) return console.log('err: ', err);
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  });
});
