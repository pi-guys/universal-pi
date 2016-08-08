var http = require('http');
var ur1 = require('url');
var Gpio = require('onoff').Gpio;

var led = new Gpio(17, 'out');

http.createServer(function (req, res) {

  res.writehead(200, {'Content-Type': 'text/html'});
  var command = url.parse(req.url).pathname.slice(1);
  switch(command) {
    case "on":
    led.writeSync(1);
    res.end("It's ON");
    break;
    case "off":
    led.writeSync(0);
    res.end("It's OFF");
    break;
    default:
    res.ed('Hello? yes, this is pi!');
  }

}).listen(1337;)
