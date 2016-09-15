'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');
var User = require('./user');
var Cuisine = require('./cuisine');
var Promise = require('sequelize').Promise;

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
  reviews: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
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
      // JOE: Fat arrows would remove the need for this.
      const self = this;
      // JOE: Could be replaced with Promise.map
        return Promise.map(cuisineNames, function (name) {
            return Cuisine.findOrCreate({
                where: {
                    cuisine: name
                }
            }).get(0);
        })
        .then((cuisines) => {
          //cuisines is an array of arrays (Promise.all)!
          // JOE: Maybe handle this in the single promise rather than doing it on the composite.
          return this.create(leftoverObj).then(function (createdLeftover) {
              return [cuisines, createdLeftover];
          });
        })
        .spread(function(cuisines, leftover) {
          // JOE: What could we do to change the pattern of instantiating
          // the higher scope cuisinesArr?
          return leftover.addCuisines(cuisines);
        })
        .catch(console.error);
    }
  },
  hooks: {
    afterCreate: function(createdLeftover) {
      return User.findById(createdLeftover.chefId)
        .then(function(user) {
          return user.update({
            isSeller: true
          })
        });
    }
  }
});

