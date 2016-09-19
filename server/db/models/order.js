'use strict';

const Sequelize = require('sequelize');
const Promise = require('bluebird');

const db = require('../_db');
const Order_Leftover = require('./order_leftover');
var options = {};

var classMethods = {
  createWithLeftovers: function(orderObj, leftoversArr, status = 'pending') {
    //leftoversArr is an array with elements of form {leftoverId : 5, quantity: 10}
    const self = this;
    return self.create(orderObj)
      .then(createdOrder => {
        return Promise.all(leftoversArr.map(l => {
          return createdOrder.addLeftover(l.leftoverId, {
              quantity: l.quantity
            })
            .then(_ => createdOrder.update({
              status: status
            }))
        }))
      })
  }
}

let hooks = {
  afterUpdate: function(createdOrder) {
    if (createdOrder.status === 'cart') {
      return this.findAll({
          where: {
            userId: createdOrder.userId,
            status: 'cart'
          }
        })
        .then(orders => {
          let otherCarts = orders.filter(or => or.id !== createdOrder.id);
          return Promise.map(otherCarts, cart => cart.destroy());
        })
    }
  }
}

options.classMethods = classMethods;
options.hooks = hooks;

module.exports = db.define('order', {
  date: {
    type: Sequelize.DATE,
    validate: {
      isDate: true
    }
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'pending'
  }
}, options);

