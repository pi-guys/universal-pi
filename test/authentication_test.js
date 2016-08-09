'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const baseUrl = 'localhost:5000/api';
const User = require('../model/user');

describe('authentication', function() {
  it('should create a user', function(done) {
    chai.request(baseUrl)
      .post('/signup')
      .send({
        username: 'test@example.com',
        password: 'foobar123'
      })
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
});
