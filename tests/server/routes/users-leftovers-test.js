// const expect = require('chai').expect;
// const supertest = require('supertest');
// const db = require('../../../server/db');
// const faker = require('faker');
//
// function generateUserInfo(){
//   return {
//     first_name: faker.name.firstName(),
//     last_name: faker.name.lastName(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//     address: faker.address.streetAddress()
//   }
// }
//
// function generateLeftoverInfo(chefId){
//   return {
//     chefId: chefId,
//     name: name,
//     description: faker.lorem.paragraph(),
//     picture: faker.image.imageUrl(),
//   }
// }
//
// describe('Users-Leftovers Route', function () {
//
//   let app, Leftover, User;
//
//
//   beforeEach('Sync DB', function () {
//     console.log('HITTING THIS');
//     return db.sync({ force: true });
//   });
//
//   beforeEach('Create app', function () {
//     console.log('HITTING THIS');
//     app = require('../../../server/app')(db);
//     Leftover = db.model('leftover');
//     User = db.model('user');
//   });
//
//   let loggedInAgent, createdUser;
//   let userInfo = generateUserInfo();
// console.log('USER INFO', userInfo);
//   beforeEach('Create a user', function (done) {
//
//     User.create(userInfo)
//       .then(function(user){
//         console.log('HITTING THIS', user);
//         createdUser = user;
//         done();
//       })
//       .catch(done);
//   });
//
//   beforeEach('Create loggedIn user agent and authenticate', function (done) {
//     loggedInAgent = supertest.agent(app);
//     loggedInAgent.post('/login').send(userInfo).end(done);
//   });
//
//   describe('Non-parameterized routes', function () {
//
//     describe('GET all of a user\'s leftovers', function () {
//
//       it('should receive an array of Leftover rows', function (done){
//         loggedInAgent.get('/api/users/' + createdUser.id + '/leftovers')
//           .expect(200).end(function (err, response) {
//             if (err) return done(err);
//             expect(response.body).to.be.an('array');
//             done();
//           });
//       });
//     });
//
//     describe('POST route', function () {
//
//       it('should get a 201 response with the user created', function (done) {
//         loggedInAgent.post('/api/users/' + createdUser.id + '/leftovers').send(generateLeftoverInfo())
//           .expect(201).end(function (err, response) {
//             if (err) return done(err);
//             Leftover.findById(response.body.id)
//               .then(function(user){
//                 expect(user).to.not.equal(null);
//                 done(err);
//               });
//           });
//       });
//     });
//
//   });
//
//   describe('Parameterized routes', function () {
//
//     let createdLeftover;
//     let leftoverInfo = generateLeftoverInfo(createdUser.id);
//
//     before('Create a leftover', function (done){
//       return Leftover.create(generateLeftoverInfo(createdUser.id))
//         .then(function(leftover){
//           createdLeftover = leftover;
//           done();
//         })
//         .catch(done);
//     });
//
//
//     describe('GET one user', function () {
//
//       it('should receive a user that matches the id parameter', function(done) {
//         loggedInAgent.get('/api/users/' + createdUser.id + '/leftovers/' + createdLeftover.id)
//           .expect(200).end(function (err, response){
//             if (err) return done(err);
//             expect(response.body.id).to.equal(createdLeftover.id);
//             done();
//           });
//       });
//
//     });
//
//     describe('PUT route', function () {
//
//       it('should get a 200 response with updated user', function(done){
//         loggedInAgent.put('/api/users/' + createdUser.id + '/leftovers/' + createdLeftover.id)
//           .send({name: 'Taco salad'})
//           .expect(200).end(function (err, response){
//             if (err) return done(err);
//             expect(response.body.id).to.equal(createdLeftover.id);
//             expect(response.body.name).to.equal('Taco salad');
//             done();
//           });
//       });
//
//     });
//
//     describe('DELETE a user', function () {
//
//       it('should get a 204 response with the deleted user', function(done){
//         loggedInAgent.delete('/api/users/' + createdUser.id + '/leftovers/' + createdLeftover.id)
//           .expect(204).end(done);
//       });
//
//
//     });
//
//   });
//
// });
