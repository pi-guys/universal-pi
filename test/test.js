'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
// const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const baseUrl = 'localhost:5000/api';
// const User = require('../model/user');

process.env.APP_SECRET = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/dev_test';

describe('test users in database', function() {
  before(function(done) {
    require('../server');
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dev_test');
    done();
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(() => console.log('test_db dropped'));
    done();
  });
  it('/POST should create a user', function(done) {
    chai.request(baseUrl)
      .post('/signup')
      .send({
        username: 'jashgu',
        password: 'eatsleep'
      })
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
});
