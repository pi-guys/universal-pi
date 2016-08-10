'use strict';
const ErrorHandler = require('./error_handler');
const assert = require('assert');

module.exports = exports = function(roles) {
  roles = roles || [];
  return function(req, res, next) {
    new Promise((resolve, reject) => {
      assert(req.user, 'No Current User');
      if (req.user.role === 'admin') return resolve();
      assert(roles.indexOf(req.user.role) !== -1, 'Unauthorized');
      resolve();
    }).then(next, ErrorHandler(401, next));
  };
};
