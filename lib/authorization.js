'use strict';
const assert = require('assert');
const jsonParser = require('body-parser').json();

module.exports = exports = function(roles) {
  roles = roles || [];
  return function(req, res, next) {
    assert(req.user, 'No user');
    let authUser = JSON.stringify(req.user);
    authUser = authUser.split('"');
    console.log(authUser[17]);
    assert(authUser[17] === 'admin', 'Unauthorized');
    if (authUser[17] === 'admin') return next(roles);
    assert(roles.indexOf(authUser[17]) !== -1, 'Unauthorized');
    next();
  };
};
