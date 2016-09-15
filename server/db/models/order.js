'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');
var Order_Leftover = require('./order_leftover');
var options = {};

var classMethods = {
  createWithLeftovers: function(orderObj, leftoversArr) {
    //leftoversArr is an array with elements of form {leftoverId : 5, quantity: 10}
    const self = this;
    return self.create(orderObj)
      .then(createdOrder => {
        return Promise.all(leftoversArr.map(l => {
          return createdOrder.addLeftover(l.leftoverId, {
            quantity: l.quantity
          });
        }))
      })
      .catch(console.error.bind(console));
  }
}

options.classMethods = classMethods;

module.exports = db.define('order', {
  date: {
    type: Sequelize.DATE,
    validate: {
      isDate: true
    }
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, options);

