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
const randomPriceGen = (min, max) => _.round(Math.random() * (max - min + 1) + min, 2);
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
    price: randomPriceGen(0.5, 30),
    picture: faker.image.food(),
    quantity: randomNumGen(1, 10),
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
          date: faker.date.past(),
          userId: buyerId,
          status: _.sample(['pending', 'complete', 'cart'])
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

const addresses = [
  '102 Dobbin Street, Brooklyn, NY',
  '41-18 48th Street Long Island City, NY 11104',
  '155 East 91st Street, New York, NY 10128',
  '61 West 74th Street, New York, NY 10023',
  '103-11 52nd Avenue Flushing, NY 11368',
  '1546 Dumont Avenue, Brooklyn, NY 11208',
  '75 Ludlow Street, New York, NY 10002',
  '142 Grand Street, New York, NY 10013',
  '330 West 36th Street, New York, NY 10018',  
  '126 Oak Street, Brooklyn, NY 11222',
  '111 East 75th Street, New York, NY 10021',
  '440-460 8th Street, Hoboken, NJ 07030',
  '123 Waverly Place, New York, NY 10011',
  '56 Clinton Street, New York, NY 10002',
  '590 6th Avenue, New York, NY 10011',
  '430 East 67th Street, New York, NY 10065',
  '225 East 111th Street, New York, NY 10029',
  '123 West 106th Street, New York, NY 10025',
  '104 West 83rd Street, New York, NY 10024',
  '122 Amsterdam Avenue, New York, NY 10023',
];

function createUser() {
  return User.create({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'abc',
    address: _.sample(addresses)
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

function seedOrders(userId) {
  let creatingOrders = [];
  let numOrders = randomNumGen(1, 10);
  for (let j = 0; j < numOrders; j++) {
    creatingOrders.push(createOrder(userId));
  }

  return Promise.all(creatingOrders);
}

function seedSellers(num) {
  var creatingSellers = [];

  for (let i = 0; i < num; i++) {
    if (i === 0) {
      creatingSellers.push(createAdminUsers());
    } else
      creatingSellers.push(createUser());
  }

  return Promise.map(creatingSellers, user => {
    return seedLeftovers(user.id).then(_ => seedOrders(user.id));
  });
}

function seedBuyers(num) {
  var creatingBuyers = [];

  for (let i = 0; i < num; i++) {
    creatingBuyers.push(createUser()
      .then(user => seedOrders(user.id)));
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
      // let randOs = _.sampleSize(os, os.length);
      return Promise.map(os, (o) => {
        return Promise.map(o.leftovers, (l) => {
          return Review.create(new RandomReview(l.id, o.userId));
        })
    })
});
}

// let randOrderLeftover = _.sample(o.leftovers);
//         let reviewObj = new RandomReview(randOrderLeftover.id, o.userId);
//         return Review.create(reviewObj);

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
    return seedSellers(20);
  })
  .then(function() {
    console.log(chalk.yellow('Seeding Buyers (And Orders, too!)...'));
    return seedBuyers(20);
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

