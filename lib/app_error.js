const ErrorHandler = require('./error_handler.js');

module.exports = exports = function(err, req, res, next) {
  res.sendError = function(err) {
    console.log(err.message);
    if (ErrorHandler.instaErrorHandler(err)) {
      return res.status(err.statusCode).send(err.responseMsg);
    }
    res.status(500).send('Internal Server Error');
  };
  next();
};
