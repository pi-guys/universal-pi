'use strict';

module.exports = exports = function(req, res, next) {
  try {
    let header = req.headers.authorization;
    let basicString = header.split(' ')[1];
    let authBuffer = new Buffer(basicString, 'base64');
    let authString = authBuffer.toString();
    let authArr = authString.split(':');
    console.log(authArr);
    req.auth = {
      username: authArr[0],
      password: authArr[1]
    };
    authBuffer.fill(0);
    next();
  } catch (e) {
    e.statusCode = 400;
    e.message = 'invalid BasicHTTP authentication';
    next();
  }
};
