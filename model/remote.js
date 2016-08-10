'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const remoteSchema = new Schema({
  name: {type:String, required:true},
  buttons: String
});

let Remote = mongoose.model('Remote', remoteSchema);
module.exports = exports = Remote;
