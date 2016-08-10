'use strict';
const mongoose = require('mongoose');
const jwt_auth = require('../lib/jwt_auth');

mongoose.connect('mongodb://localhost/auth_test');
app = require('express')();
const authRouter = require('../route/user_router');
app.use('/api', authRouter);
app.get('/api/jwt_auth', jwt_auth, function(req, res){
  res.json({msg: 'sucess!'});
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});
app.listen(5000);
