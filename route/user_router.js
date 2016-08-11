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
  if (!req.body.username || !req.body.password) {
    next(AppError.error400('A username and password are both required.'));
  }
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save((err, user) => {
        if (user === null) return next(AppError.error500('Database error.'));
        if (err) return next(AppError.error400('A user with that name already exists.'));
        console.log('new user\n' + user);
        res.json(tokenData);
      });
    });
});

userRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = AppError.error401('Authentication failed.');
  console.log(req.auth.username);
  User.findOne({username: req.auth.username}, (err, user) => {
    if (!user) next(authError);
    if (err) next(authError);
    user.comparePassword(req.auth.password)
      .then(res.json.bind(res))
      .catch(() => {
        next(authError);
      });
  });
});

userRouter.delete('/:username', jwtAuth, auth, (req, res, next) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if (err) return next(AppError.error400('No user found.'));
    console.log(user);
    if (!user || user === null) {
      return next(AppError.error400('No user found.'));
    } else {
      User.remove({username: req.params.username}, (err) => {
        if (err) next(AppError.error400('Bad request.'));
        console.log('removing ' + user.username);
        res.send('Deleted user');
      });
    }
  });
});

userRouter.use((req, res, next) => {
  next(AppError.error404('Specified request not found.'));
});
