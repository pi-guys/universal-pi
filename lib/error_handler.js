'use strict';

let AppError = module.exports = exports = function(message, statusCode, responseMessage){
  this.message = message;
  this.statusCode = statusCode;
  this.responseMessage = responseMessage;
};

AppError.error204 = function(msg){
  return new AppError(msg, 204, 'No Content');
};

AppError.error400 = function(msg){
  return new AppError(msg, 400, 'Bad Request');
};

AppError.error404 = function(msg){
  return new AppError(msg, 404, 'File Not Found');
};

AppError.error500 = function(msg){
  return new AppError(msg, 500, 'Internal Server Error');
};

AppError.instAppError = function(error){
  return error instanceof AppError;
};
