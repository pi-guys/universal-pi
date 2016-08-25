'use strict';
const AppError = require('./app_error');


module.exports = exports = function(req, res, next) {
  //console.log(req.user[0].role);
  if (req.user[0].role !== 'admin') next(AppError.error401('Unauthorized.'));
  if (req.user[0].role === 'admin') {
    console.log('Authorized');
    next();
  }
};