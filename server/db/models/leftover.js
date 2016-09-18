'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');
var User = require('./user');
var Cuisine = require('./cuisine');

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
  quantity: {
    type: Sequelize.INTEGER
  },
  rating: {
    type: Sequelize.INTEGER,
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

