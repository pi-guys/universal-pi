'use strict';

const express = require('express');
const route = require('../route/route.js');

let server = module.exports = exports = express();

server.use('/api', route);
