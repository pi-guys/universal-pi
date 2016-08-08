'use strict';

let ErrorHandler = module.exports = exports = function(msg, statusCode, responseMsg){
  this.msg = msg;
  this.statusCode = statusCode;
  this.responseMsg = responseMsg;
};

ErrorHandler.error404 = function(message){
  return new ErrorHandler(message, 404, 'File Not Found');
};

ErrorHandler.error400 = function(message){
  return new ErrorHandler(message, 400, 'Bad Request');
};

ErrorHandler.instaErrorHandler = function(error){
  return error instanceof ErrorHandler;
};
