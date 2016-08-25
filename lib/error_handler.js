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
//doesn't appear this code is being used
//since you're not using currying like Tyler's example in class you don't need  to wrap your 
//middleware in a function - then when you use it you don't need to execute it
/*
module.exports = exports = function(req, res, next) {
  res.sendError = function(error) {
    console.log(error.message);
    if (AppError.instAppError(error)) {
      return res.status(error.statusCode).send(error.message);
    }
    res.status(500).send('Internal Server Error');
  };
  next();
};

// in your Server
app.use(errorHandler);
*/