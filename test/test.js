'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const server = require('./test_server');
const baseUrl = 'localhost:5000/api';
const User = require('../model/user');

const PORT = process.env.PORT || 5000;

process.env.APP_SECRET = 'testmenow';
process.env.MONGODB_TEST = 'mongodb://localhost/dev_test';

let testToken;
let testFalseToken;

describe('test SIGNUP with user routes', () => {
  before((done) => {
    server.listen(PORT, () => {
      console.log('server is up on 5000');
    });
    request(baseUrl)
      .post('/user/signup')
      .send({username: 'darthvader', password: 'darkside'})
      .end((err, res) => {
        if (err) console.log(err);
        testToken = res.body.token;
        User.update({username: 'darthvader'}, {$set: {role: 'admin'}}, (err) => {
          if (err) console.log(err);
        });
      });
    request(baseUrl)
      .post('/user/signup')
      .send({username: 'luke', password: 'skywalker'})
      .end((err) => {
        if (err) console.log(err);
        User.find({username: 'luke'}, (err, user) => {
          if (err) console.log(err);
          testUserId = user.toString().slice(7, 31);
        });
      });
    done();
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      console.log('test_db dropped');
      server.close(done);
    });
  });

  it('/POST should create a user', (done) => {
    request(baseUrl)
      .post('/user/signup')
      .send({username: 'eatsleep', password: 'pooprepeat'})
      .end((err, res) => {
        testFalseToken = res.body.token;
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
  it('/POST should reply with a 400 error with invalid body', (done) => {
    request(baseUrl)
      .post('/user/signup')
      .send({username: 'james', pass: ''})
      .end((err, res) => {
        expect(err.status).to.eql(400);
        expect(res.text).to.eql('A username and password are both required.');
        done();
      });
  });
  it('/POST should reply with a 400 error if a user already exists', (done) => {
    request(baseUrl)
      .post('/user/signup')
      .send({username: 'eatsleep', password: 'pooprepeat'})
      .end((err, res) => {
        expect(err.status).to.eql(400);
        expect(res.text).to.have.string('already exists');
        done();
      });
  });

  it('/GET should successfully signin', (done) => {
    request(baseUrl)
      .get('/user/signin')
      .auth('eatsleep', 'pooprepeat')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.length).to.not.eql(0);
        done();
      });
  });
  it('/GET should reply with 401 error if wrong username or password is provided', (done) => {
    request(baseUrl)
      .get('/user/signin')
      .auth('eatsleep', 'repeat')
      .end((err, res) => {
        expect(err.status).to.eql(401);
        expect(res.text).to.have.string('Authentication failed.');
        done();
      });
  });
  it('/GET should reply with a 404 error if page does not exist', (done) => {
    request(baseUrl)
      .get('/user/sign')
      .end((err, res) => {
        expect(err.status).to.eql(404);
        expect(res.text).to.have.string('not found');
        done();
      });
  });

  it('/DELETE should remove the specified user', (done) => {
    request(baseUrl)
      .delete('/user/luke')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.text).to.eql('Deleted user');
        done();
      });
  });
  it('/DELETE should reply with error 401 if user is unauthorized', (done) => {
    request(baseUrl)
    .delete('/user/darthvader')
    .set('Authorization', 'Bearer ' + testFalseToken)
    .end((err, res) => {
      expect(err.status).to.eql(401);
      expect(res.text).to.eql('Unauthorized.');
      done();
    });
  });
  it('/DELETE should reply with error 400 if user not found', (done) => {
    request(baseUrl)
      .delete('/user/hansolo')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        expect(err.status).to.eql(400);
        expect(res.text).to.eql('No user found.');
        done();
      });
  });
});

describe('it should send commands to the remote', () => {
  before((done) => {
    server.listen(PORT, () => {
      console.log('server is up on 5000');
      done();
    });
  });
  after((done) => {
    server.close(done);
  });

  it('/POST should send the command to the device', (done) => {
    request(baseUrl)
      .post('/remote/Vizio/KEY_POWER')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.text).to.have.string('Vizio');
        expect(res.text).to.have.string('KEY_POWER');
        done();
      });
  });
  it('/POST should reply with a 404 error when an invalid body is provided', (done) => {
    request(baseUrl)
      .post('/remote/Samsung/')
      .end((err, res) => {
        expect(err.status).to.eql(404);
        expect(res.text).to.have.string('Please specify a remote');
        done();
      });
  });
});
