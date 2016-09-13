'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');
var User =require('./user');
var Cuisine = require('./cuisine');

module.exports = db.define('leftover', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            min: 25
        }
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
        validate: {
            max: 5
        }
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
      createWithCuisines: function(leftoverObj, cuisineNames){
        let cuisinesArr;
        const self = this;
        return Promise.all(cuisineNames.map(function(name){
          return Cuisine.findOrCreate({
            where: {
              cuisine: name
            }
          })
        }))
        .then(function(cuisines){
          //cuisines is an array of arrays (Promise.all)!
          cuisinesArr = cuisines.map(cuisine=>cuisine[0]);
          console.log(cuisinesArr);
          return self.create(leftoverObj);
        })
        .then(function(leftover){
          return leftover.addCuisines(cuisinesArr);
        })
        .catch(console.error);
      }
    },
    hooks: {
        afterCreate: function(createdLeftover){
            User.findById(createdLeftover.chefId)
            .then(function(user){
                user.isSeller = true;
            });
        }
    }
});
