'use strict';
const ErrorHandler = require('./error_handler.js');

module.exports = exports = function(req, res, next) {
  res.sendError = function(error) {
    console.log(error.message);
    if(ErrorHandler.instAppError(error)){
      return res.status(error.statusCode).send(error.responseMessage);
    }
    res.status(500).send('Internal Server Error');
  };
  next();
};
