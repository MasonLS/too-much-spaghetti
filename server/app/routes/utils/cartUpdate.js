'use strict';
const Order = require('../../../db/models/order');
const Leftover = require('../../../db/models/leftover');
const Order_Leftover = require('../../../db/models/order_leftover');
const Promise = require('bluebird');

module.exports = {

  update: function(ls, updatedL) {
    if (!ls.some(l => l.leftoverId === updatedL.leftoverId)) {
      let res = ls.slice(0);
      res.push(updatedL);
      return res;
    }
    return ls.map(le => {
      if (le.leftoverId === updatedL.leftoverId) return {
        leftoverId: updatedL.leftoverId,
        quantity: updatedL.quantity
      }
      return le;
    })
  },

  delete: function(ls, leftoverIdToDelete) {
    return ls.filter(l => l.leftoverId !== leftoverIdToDelete)
  },

  createCartInDb: function(userId, cart) {
    return Order.createWithLeftovers({
      userId: userId
    }, cart, 'cart');
  },

  updateCartElemInDb: function(cartOrderId, updatedL) {
    return Order_Leftover.findOne({
        where: {
          orderId: cartOrderId,
          leftoverId: updatedL.leftoverId
        }
      })
      .then(row => {
        if (!row)
          return Order_Leftover.create({
            orderId: cartOrderId,
            leftoverId: updatedL.leftoverId,
            quantity: updatedL.quantity
          })
        return row.update({
          orderId: cartOrderId,
          quantity: updatedL.quantity
        })
      })
  },

  deleteCartElemInDb: function(cartOrderId, leftoverIdToDelete) {
    return Order_Leftover.findOne({
        where: {
          orderId: cartOrderId,
          leftoverId: leftoverIdToDelete
        }
      })
      .then(row => {
        return row.destroy()
      })
  },

  //serialized cart is an array of the form {leftoverId: 4, quantity: 10}
  deserializeCart: function(serializedCart) {
    if (!serializedCart) return Promise.all([]);
    return Promise.map(serializedCart, cartItem => {
      return Leftover.findById(cartItem.leftoverId)
        .then(leftover => {
          return {
            leftover: leftover,
            quantity: cartItem.quantity
          }
        })
    })
  },

  serializeCart: function(deserializedCart) {
    return deserializedCart.map(dc => {
      return {
        leftoverId: dc.leftover.id,
        quantity: dc.quantity
      }
    })
  },

  isEmpty: function(cartArr) {
    return !Array.isArray(cartArr) || cartArr.length === 1 && Object.keys(cartArr[0]).length === 0
  }
}

