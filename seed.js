/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Leftover = db.model('leftover');
var Cuisine = db.model('cuisine');
var Promise = require('sequelize').Promise;
var faker = require('faker');


//function to be called inside seedUsers
function seedCuisines(){
  var cuisines = [
    {name: 'chinese'},
    {name: 'korean'},
    {name: 'ethiopian'},
    {name: 'japanese'},
    {name: 'american'},
    {name: 'french'},
    {name: 'austrian'},
    {name: 'polish'},
    {name: 'georgian'},
    {name: 'indian'},
    {name: 'italian'},
    {name: 'venezuelan'}
  ];

  var creatingCuisines = cuisines.map(function (cuisineObj) {
    return Cuisine.create(cuisineObj);
  });

  return Promise.all(creatingCuisines);
}

var leftoverNames = ['sweet-and-sour chicken', 'bibimbap', 'injera', 'sushi', 'meatloaf', 'croque madame', 'schnitzel', 'pierogi', 'khachapuri', 'dosa', 'spaghetti', 'arepa']

//creates a leftover and adds a cuisine to it
//DOES NOT ASSOCIATE cuisine.addleftover
function createLeftover(name, chefId){
  let randNum = Math.floor(Math.random()*4) + 1;

  let randCuisines = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = Math.floor(Math.random()*(cuisines.length-1)) + 0;
    let randCuisine = cuisines[randIndex];

    if(!randCuisines.includes(randCuisine)) {
      randCuisines.push(cuisines[randIndex]);
    } else i--;

  }

  return Leftover.create({
    chefId: chefId,
    name: name,
    cuisines: cuisines,
    description: faker.lorem.paragraph(),
    picture: faker.image.imageUrl(),
  });
}

function seedLeftovers(chefId){
  let randNum = Math.floor(Math.random()*4) + 1;

//array of promises
  let randLeftovers = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = Math.floor(Math.random()*(leftoverNames.length-1)) + 0;
    let randLeftover = createLeftover(leftoverNames[randIndex], chefId);

    if(!randLeftovers.includes(randLeftover)) {
      randLeftovers.push(randLeftover);
    } else i--;

  }

  return Promise.all(randLeftovers);
}

function createUser(){
  return User.create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    address: faker.address.streetAddress()
  });
}

function seedSellers(num){
  var creatingSellers = [];

  for(let i = 0; i < num; i++){
    creatingSellers.push(createUser()
    .then(user => seedLeftovers(user.id)));
  }

  return Promise.all(creatingSellers);
}

function seedOrders(){}

function seedBuyers(){}

var seedUsers = function (num) {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

var seedProducts

var seedCuisines

db.sync({ force: true })
    .then(function () {
        return seedCuisines();
    })
    .then(function () {
      return seedSellers(50);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
