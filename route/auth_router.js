'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const AppError = require('../lib/app_error');
const User = require('../model/user');
const BasicHTTP = require('../lib/basic_http');
// const authzn = require('../lib/authorization');
// const jwt_auth = require('../lib/jwt_auth');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save().then(res.json.bind(tokenData), AppError.error400('Bad request'));
    }, next(AppError.error400('Bad request')));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  User.findOne({'username': req.auth.username})
    .then((user) => {
      if (!user) return AppError.error400('Bad request');
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), AppError.error400('Bad request'));
    }, next(AppError.error400('Bad request')));
});
//
// authRouter.put('/addrole?:userid', jsonParser, jwt_auth, authzn(), (req, res, next) => {
//   user.update({'_id': req.params.userid}, {$set: {role: req.body.role}})
//   .then(res.json.bind(res), ErrorHandler(500, next, 'server'}));
//
//     authrouter.get('/users', jsonParser, jwt_auth, authzn(), (req, res, next) => {
//         user.find().then(res.json.bind(res), ErrorHandler(500, next, 'server error'));
//     }));
