'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type:String, default: 'basic'},
  group: {type: String, default: 'codefellows'}
});

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, data) => {
      if (err) return reject(err);
      this.password = data;
      resolve ({token: jwt.sign({idd: this.username},process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePassword = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, data) =>{
      if (err) return reject(err);
      if (data === false) return reject(new Error('Password did not match'));
      resolve({token: jwt.sign({idd: this.username}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('User', userSchema);
