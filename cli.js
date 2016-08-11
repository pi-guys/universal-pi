'use strict';

const exec = require('child_process').exec;
let args = process.argv.slice(2);
let call;

if (args.length < 1) {
  return console.log('Please enter valid arguments');
}
switch (args[0]) {
case 'signup':
<<<<<<< HEAD
  call = `curl -H 'Content-Type: application/json' -X POST -d '{"username":"` + args[1] + `","password":"` + args[2] + `"}' https://universal-pi.herokuapp.com/api/user/signup`;
=======
  call = 'curl -H \'Content-Type: application/json\' -X POST -d \'{"username":"' + args[1] + '","password":"' + args[2] + '"}\' https://universal-pi.herokuapp.com/api/user/signup';
>>>>>>> 501af3e0b7d713d1d453c96ed12b3ac2aaeb2274
  break;
case 'signin':
  call = 'curl --user ' + args[1] + ':' + args[2] + ' https://universal-pi.herokuapp.com/api/user/signin';
  break;
case 'key':
  call = 'curl https://universal-pi.herokuapp.com/api/remote/' + args[1] + '/KEY_' + args[2].toUpperCase();
  break;
case 'get':
  call = 'curl https://universal-pi.herokuapp.com/api/remote/' + args[1];
  break;
}

console.log(call);

exec(call, function(error, stdout) {
  if (error !== null) console.log('exec error: ' + error);
  if (stdout !== null) console.log(stdout);
});
