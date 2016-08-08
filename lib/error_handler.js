'use strict';
const AppError = require('./app_error.js');

module.exports = exports = function() {
  return (req, res, next) => {
    res.sendError = function(error) {
      console.log(error.message);
      if (AppError.instAppError(error)) {
        return res.status(error.statusCode).send(error.message);
      }
      res.status(500).send('Internal Server Error');
    };
    next();
  };
};
