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
var Order = db.model('order');

// JOE: Make your life easier, do something like this:
var cuisines = ['chinese', 'korean'].map(function (cuisineName) {
  return { cuisine: cuisineName };
})

var cuisines = [{
  cuisine: 'chinese'
}, {
  cuisine: 'korean'
}, {
  cuisine: 'ethiopian'
}, {
  cuisine: 'japanese'
}, {
  cuisine: 'american'
}, {
  cuisine: 'french'
}, {
  cuisine: 'austrian'
}, {
  cuisine: 'polish'
}, {
  cuisine: 'georgian'
}, {
  cuisine: 'indian'
}, {
  cuisine: 'italian'
}, {
  cuisine: 'venezuelan'
}];

//function to be called inside seedUsers
function seedCuisines() {

  // JOE: Great use of .map and Promise.all in conjunction
  // but could be made even better using Promise.map
    return Promise.map(cuisines, function (cuisine) {
        return Cuisine.create(cuisine);
    })
}

var leftoverNames = ['sweet-and-sour chicken', 'bibimbap', 'injera', 'sushi', 'meatloaf', 'croque madame', 'schnitzel', 'pierogi', 'khachapuri', 'dosa', 'spaghetti', 'arepa']

//creates a leftover and adds a cuisine to it
//DOES NOT ASSOCIATE cuisine.addleftover

function createLeftover(name, chefId) {
  // JOE: lodash has a convenient .random function.
  let randNum = Math.floor(Math.random() * 4) + 1;

  let randCuisines = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = Math.floor(Math.random() * (cuisines.length - 1)) + 0;

    // JOE: I am having trouble understanding this logic.
    if (!randCuisines.includes(randIndex)) {
      randCuisines.push(cuisines[randIndex].cuisine);
    } else i--;

  }


  return Leftover.createWithCuisines({
    chefId: chefId,
    name: name,
    description: faker.lorem.paragraph(),
    picture: faker.image.imageUrl(),
  }, randCuisines);

}

function getRandomLeftoverIds() {
  let randNum = Math.floor(Math.random() * 4) + 1;
  let randLeftovers = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = Math.floor(Math.random() * (cuisines.length - 1)) + 0;

    if (!randLeftovers.includes(randIndex)) {
      randLeftovers.push(randIndex);
    } else i--;
  }

  return Leftover.findAll()
    .then(leftovers => {
      return leftovers.filter((leftover, i) => {
        return randLeftovers.includes(i)
      });
    })
    .then(leftovers => leftovers.map(leftover => leftover.id));
}


function createOrder(userId) {

  return getRandomLeftoverIds()
    .then(ids => {
      return Order.create({
        userId: userId,
        leftover_ids: ids,
        status: 'pending'
      });
    })

}


function seedLeftovers(chefId) {
  let randNum = Math.floor(Math.random() * 4) + 1;

  //array of promises
  let randLeftovers = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = Math.floor(Math.random() * (leftoverNames.length - 1)) + 0;
    let randLeftover = createLeftover(leftoverNames[randIndex], chefId);

    if (!randLeftovers.includes(randLeftover)) {
      randLeftovers.push(randLeftover);
    } else i--;

  }

  return Promise.all(randLeftovers);
}

function createUser() {
  return User.create({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    address: faker.address.streetAddress()
  });
}

function createAdminUsers() {
  return User.create({
    first_name: 'Test',
    last_name: 'McTestie',
    email: 'a@a.com',
    password: 'abc',
    address: '5 Hanover Sq, New York, New York 11104',
    isAdmin: true
  });
}

function seedSellers(num) {
  var creatingSellers = [];

  // JOE: Great usage of promises in here.
  for (let i = 0; i < num; i++) {
    if (i === 0) {
      creatingSellers.push(createAdminUsers()
        .then(user => seedLeftovers(user.id)));
    } else
      creatingSellers.push(createUser()
        .then(user => seedLeftovers(user.id)));
  }


  return Promise.all(creatingSellers);
}

function seedBuyers(num) {
  var creatingBuyers = [];

  // JOE: lodash also has a pretty cool _.range function
  // so you can _.range(num).map() instead of a for loop
  for (let i = 0; i < num; i++) {
    creatingBuyers.push(createUser()
      .then(function(user) {
        return createOrder(user.id);
      }));
  }

  return Promise.all(creatingBuyers);

}


db.sync({
    force: true
  })
  .then(function() {
    return seedCuisines();
  })
  .then(function() {
    return seedSellers(50);
  })
  .then(function() {
    return seedBuyers(25);
  })
  .then(function() {
    console.log(chalk.green('Seed successful!'));
    process.exit(0);
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });

