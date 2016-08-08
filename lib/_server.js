'use strict';

const express = require('express');
const route = require('../route/route.js');
const authRouter = require('../route/auth_router.js');
let server = module.exports = exports = express();

server.use('/api', route);
server.use('/api/user', authRouter);
