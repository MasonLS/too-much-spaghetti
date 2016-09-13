'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');
var User =require('./user');

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
    hooks: {
        afterCreate: function(createdLeftover){
            User.findById(createdLeftover.chefId)
            .then(function(user){
                user.isSeller = true;
            });
        }
    }
});
