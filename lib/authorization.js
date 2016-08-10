'use strict';
// const ErrorHandler = require('./error_handler');
const AppError = require('./app_error');
const assert = require('assert');

module.exports = exports = function(req, res, next) {
  console.log(req.user[0].role);
  if (req.user[0].role !== 'admin') next(AppError.error401('Unauthorized.'));
  if (req.user[0].role === 'admin') {
    console.log('Authorized');
    next();
  }
  // return new Promise((resolve, reject) => {
  //   if (req.user.role === 'admin') {
  //     resolve();
  //   } else {
  //     console.log('error');
  //     reject();
  //   }
  // });
};
