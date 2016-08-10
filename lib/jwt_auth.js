'use strict';

const jwt = require('jsonwebtoken');
const assert = require('assert');
const User = require('../model/user');

module.exports = exports = function(req, res, next) {
  assert(req.header.authorization, 'Invalid or no request header.');
  let authHeader = req.headers.authorization.split(' ');
  assert(authHeader[0] === 'Bearer', 'No auth token provided.');
  let jsonToken = jwt.verify(authHeader[1], process.env.APP_SECRET);
  assert(jsonToken, 'Invalid Token');
  User.find({username: jsonToken.idd}, (err, user) => {
    if (err) return next(err);
    req.user = user;
    next();
  });
};
