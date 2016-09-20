'use strict';

const Sequelize = require('sequelize');

const db = require('../_db');
const User = require('./user');
const Cuisine = require('./cuisine');

module.exports = db.define('leftover', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  picture: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
  price: {
    type: Sequelize.FLOAT
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  rating: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  expiration_time: {
    type: Sequelize.DATE,
    validate: {
      isDate: true
    }
  }
}, {
  classMethods: {
    createWithCuisines: function(leftoverObj, cuisineNames) {
      let cuisinesArr;
      const self = this;
      return Promise.all(cuisineNames.map(function(name) {
          return Cuisine.findOrCreate({
            where: {
              name: name
            }
          })
        }))
        .then(function(cuisines) {
          //cuisines is an array of arrays (findOrCreate)!
          cuisinesArr = cuisines.map(cuisine => cuisine[0].id);
          return self.create(leftoverObj);
        })
        .then(function(leftover) {
          return leftover.setCuisines(cuisinesArr);
        })
        .catch(console.error);
    }
  },
  hooks: {
    afterCreate: function(createdLeftover) {
      // return User.findById(createdLeftover.chefId)
        // .then(function(user) {
          // return user.update({
            // isSeller: true
          // })
        // });
    }
  }
});

