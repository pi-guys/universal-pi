'use strict';
const jwt = require('jsonwebtoken');
const assert = require('assert');
const User = require('../model/user');

module.exports = exports = function(req, res, next) {
  assert(req.headers.authorization, 'No authorization header provided');
  let authHeader = req.headers.authorization.split(' ');
  assert(authHeader[0] === 'Bearer', 'No auth token provided');
  let jsonToken = jwt.verify(authHeader[1], process.env.APP_SECRET);
  User.find({username: jsonToken.idd}, (err, user) => {
    if (err || user === null) next(err);
    req.user = user;
    next();
  });
};
