'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const AppError = require('../lib/app_error');
const User = require('../model/user');
const BasicHTTP = require('../lib/basic_http');
const auth = require('../lib/authorization');
const jwtAuth = require('../lib/jwt_auth');

let userRouter = module.exports = exports = Router();

userRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  if (!req.body.username || !req.body.password) {
    next(AppError.error400('A username and password field are required.'));
  }
  newUser.username = req.body.username;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save((err, user) => {
        if (err) next(err);
        console.log('new user + ' + user.toString());
        res.json(tokenData);
      });
    });
});

userRouter.get('/signin', BasicHTTP, (req, res, next) => {
  console.log(req.auth.username);
  User.findOne({username: req.auth.username}, (err, user) => {
    if (!user) next(AppError.error401('Authentication failed.'));
    if (err) next(AppError.error401('Authentication failed.'));
    user.comparePassword(req.auth.password)
      .then(res.json.bind(res))
      .catch((err) => {
        next(err);
      });
  });
});

userRouter.delete('/:id', jwtAuth, auth, (req, res, next) => {
  User.remove({'_id': req.params.id}, (user) => {
    res.send(user);
  });
});

// authRouter.put('/addrole?:userid', jsonParser, jwt_auth, authzn(), (req, res, next) => {
//   user.update({'_id': req.params.userid}, {$set: {role: req.body.role}})
//   .then(res.json.bind(res), ErrorHandler(500, next, 'server'}));
//
// authrouter.get('/users', jsonParser, jwt_auth, authzn(), (req, res, next) => {
//         user.find().then(res.json.bind(res), ErrorHandler(500, next, 'server error'));
//     }));
