const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Leftover = db.model('leftover');
const Cuisine = db.model('cuisine');
const Order_Leftover = db.model('order_leftover');
const Review = db.model('review');
const Promise = require('sequelize').Promise;
const faker = require('faker');
const Order = db.model('order');
const _ = require('lodash');

const randomNumGen = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const cuisineNames = ['chinese', 'korean', 'ethiopian', 'japanese', 'american', 'french', 'austrian', 'polish', 'georgian', 'indian', 'italian', 'venezulean']
let cuisines = cuisineNames.map(c => {
  return {
    name: c
  }
});

//function to be called inside seedUsers
function seedCuisines() {
  return Promise.map(cuisines, function(c) {
    return Cuisine.create(c);
  });
}

let leftoverNames = ['sweet-and-sour chicken', 'bibimbap', 'injera', 'sushi', 'meatloaf', 'croque madame', 'schnitzel', 'pierogi', 'khachapuri', 'dosa', 'spaghetti', 'arepa']

//creates a leftover and adds a cuisine to it
function createLeftover(name, chefId) {
  let randNum = Math.floor(Math.random() * 4) + 1;

  let randCuisines = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = Math.floor(Math.random() * (cuisines.length - 1)) + 0;

    if (!randCuisines.includes(randIndex)) {
      randCuisines.push(cuisines[randIndex].name);
    } else i--;
  }
  randCuisines = _.uniq(randCuisines);

  return Leftover.createWithCuisines({
    chefId: chefId,
    name: name,
    description: faker.lorem.paragraph(),
    picture: faker.image.imageUrl(),
    quantity: randomNumGen(1, 10),
    rating: randomNumGen(1, 5),
  }, randCuisines);

}

function getRandomLeftoverIds() {
  let randNum = Math.floor(Math.random() * 4) + 1;
  let randLeftovers = [];

  for (let i = 0; i < randNum; i++) {
    let randIndex = randomNumGen(0, cuisines.length);

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

function createOrder(buyerId) {

  return getRandomLeftoverIds()
    .then(ids => {
      let orderObj = {
          userId: buyerId,
        },
        status = _.sample(['pending', 'complete', 'cart']),
        leftoversArr = ids.map(id => {
          return {
            leftoverId: id,
            quantity: randomNumGen(1, 4)
          }
        });
      return Order.createWithLeftovers(orderObj, leftoversArr, status);
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
    password: 'abc',
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

  for (let i = 0; i < num; i++) {
    creatingBuyers.push(createUser()
      .then(function(user) {
        return createOrder(user.id);
      }));
  }

  return Promise.all(creatingBuyers);

}

function RandomReview(leftoverId, userId) {
  this.stars = randomNumGen(1, 5);
  this.body = faker.lorem.sentence();
  this.leftoverId = leftoverId;
  this.userId = userId;
}

function writeReviews() {
  return Order.findAll({
      where: {},
      include: [Leftover]
    })
    .then(os => {
      let randOs = _.sampleSize(os, os.length);
      return Promise.map(randOs, (o) => {
        let randOrderLeftover = _.sample(o.leftovers);
        let reviewObj = new RandomReview(randOrderLeftover.id, o.userId);
        return Review.create(reviewObj);
      })
    })
}

function getCart() {
  return Order.findAll({
      where: {
        status: 'cart'
      },
      include: [User]
    })
    .then(orders => {
      let randomCartBuyer = _.sample(orders).user;
      return randomCartBuyer.getCart();
    })
}

db.sync({
    force: true
  })
  .then(function() {
    console.log(chalk.blue('Seeding Cuisines...'));
    return seedCuisines();
  })
  .then(function() {
    console.log(chalk.red('Seeding Sellers...'));
    return seedSellers(50);
  })
  .then(function() {
    console.log(chalk.yellow('Seeding Buyers...'));
    return seedBuyers(25);
  })
  .then(function() {
    console.log(chalk.magenta('Writing Reviews...'));
    return writeReviews();
  })
  .then(function() {
    console.log(chalk.magenta('getting cart...'));
    return getCart();
  })
  .then(function(cart) {
    console.log('random user cart', cart);
    console.log(chalk.green('Seed successful!'));
    process.exit(0);
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });

