const expect = require('chai').expect;
const supertest = require('supertest');
const db = require('../../../server/db');
const faker = require('faker');

describe('Users Route', function () {

  let app, User;

  function generateUserInfo(){
    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.address.streetAddress()
    }
  }

  beforeEach('Sync DB', function () {
    return db.sync({ force: true });
  });

  beforeEach('Create app', function () {
    app = require('../../../server/app')(db);
    User = db.model('user');
  });

  describe('Non-parameterized routes', function () {

    let guestAgent;

    beforeEach('Create an authenticated/guest user', function () {
      guestAgent = supertest.agent(app);
    });

    describe('GET all users', function () {

      it('should receive an array of User rows', function (done){
        guestAgent.get('/api/users/')
          .expect(200).end(function (err, response) {
            if (err) return done(err);
            expect(response.body).to.be.an('array');
            done();
          });
      });
    });

    describe('GET all sellers', function () {

      it('should receive an array of Users who are sellers rows', function (done){
        guestAgent.get('/api/users/sellers')
          .expect(200).end(function (err, response) {
            if (err) return done(err);
            expect(response.body).to.be.an('array');
            expect(response.body.every(function(user){return !!user.isSeller}));
            done();
          });
      });
    });

    describe('POST route', function () {

      it('should get a 201 response with the user created', function (done) {
        guestAgent.post('/api/users').send(generateUserInfo())
          .expect(201).end(function (err, response) {
            if (err) return done(err);
            User.findById(response.body.id)
              .then(function(user){
                expect(user).to.not.equal(null);
                done(err);
              });
          });
      });
    });

  });

  describe('Parameterized routes', function () {

    let loggedInAgent, createdUser;
    let userInfo = generateUserInfo();

    beforeEach('Create a user', function (done) {
      return User.create(userInfo)
        .then(function(user){
          createdUser = user;
          done();
        })
        .catch(done);
    });

    beforeEach('Create loggedIn user agent and authenticate', function (done) {
      loggedInAgent = supertest.agent(app);
      loggedInAgent.post('/login').send(userInfo).end(done);
    });

    describe('GET one user', function () {

      it('should receive a user that matches the id parameter', function(done) {
        loggedInAgent.get('/api/users/' + createdUser.id)
          .expect(200).end(function (err, response){
            if (err) return done(err);
            expect(response.body.id).to.equal(createdUser.id);
            done();
          });
      });

    });

    describe('PUT route', function () {

      it('should get a 200 response with updated user', function(done){
        loggedInAgent.put('/api/users/' + createdUser.id)
          .send({first_name: 'Donald'})
          .expect(200).end(function (err, response){
            if (err) return done(err);
            expect(response.body.id).to.equal(createdUser.id);
            expect(response.body.first_name).to.equal('Donald');
            done();
          });
      });

    });

    describe('DELETE a user', function () {

      it('should get a 204 response with the deleted user', function(done){
        loggedInAgent.delete('/api/users/' + createdUser.id)
          .expect(204).end(done);
      });


    });

  });

});
