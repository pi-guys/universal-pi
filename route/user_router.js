'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const AppError = require('../lib/app_error');
const User = require('../model/user');
const BasicHTTP = require('../lib/basic_http');
// const authzn = require('../lib/authorization');
const jwtAuth = require('../lib/jwt_auth');

let userRouter = module.exports = exports = Router();

userRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save((err) => {
        if (err) next(err);
        res.json(tokenData);
      });
    });
});

userRouter.get('/signin', BasicHTTP, (req, res, next) => {
  console.log(req.auth.username);
  User.findOne({username: req.auth.username}, (err, user) => {
    if (!user) {
      return AppError.error401('Authentication failed.');
    }
    if (err) {
      return AppError.error401('Authentication failed.');
    }
    console.log(user);
    user.comparePassword(req.auth.password)
      .then(res.json.bind(res))
      .catch((err) => {
        next(err);
      });
  });
});

userRouter.delete('/:id', jsonParser, jwtAuth, (req, res, next) => {
  User.remove({'_id': req.params.id}, (err, user) => {
    if (err) next(err);
    res.json(user);
  });
});
