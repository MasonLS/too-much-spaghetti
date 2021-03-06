'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const Sequelize = require('sequelize');
const db = require('../_db');
const Leftover = require('./leftover');
const Promise = require('sequelize').Promise;

module.exports = db.define('user', {
  first_name: {
    type: Sequelize.STRING,
    alowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isSeller: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  payment_info: {
    type: Sequelize.INTEGER,
    validate: {
      isCreditCard: true
    }
  },
  salt: {
    type: Sequelize.STRING
  },
  twitter_id: {
    type: Sequelize.STRING
  },
  facebook_id: {
    type: Sequelize.STRING
  },
  google_id: {
    type: Sequelize.STRING
  }
}, {
  instanceMethods: {
    sanitize: function() {
      return _.omit(this.toJSON(), ['password', 'salt']);
    },
    correctPassword: function(candidatePassword) {
      return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
    },
    getCart: function() {
      return this.getOrders({
          where: {
            status: 'cart'
          },
          include: [Leftover]
        })
        .spread(cartOrder => {
          if(cartOrder) return Promise.map(cartOrder.leftovers, (le) => {
            return {
              leftover: le,
              quantity: le.order_leftover.quantity,
              orderId: cartOrder.id
            }
          })
        })
    }
  },
  classMethods: {
    generateSalt: function() {
      return crypto.randomBytes(16).toString('base64');
    },
    encryptPassword: function(plainText, salt) {
      var hash = crypto.createHash('sha1');
      hash.update(plainText);
      hash.update(salt);
      return hash.digest('hex');
    }
  },
  hooks: {
    beforeCreate: function(user) {
      if (user.changed('password')) {
        user.salt = user.Model.generateSalt();
        user.password = user.Model.encryptPassword(user.password, user.salt);
      }
    },
    beforeUpdate: function(user) {
      if (user.changed('password')) {
        user.salt = user.Model.generateSalt();
        user.password = user.Model.encryptPassword(user.password, user.salt);
      }
    }
  }
});

