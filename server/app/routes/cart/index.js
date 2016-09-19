'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Order = require('../../../db/models/order');
const Review = require('../../../db/models/review');
const User = require('../../../db/models/user');
const Leftover = require('../../../db/models/leftover');
const Err = require('../utils/err').gen;
const Promise = require('bluebird');

let unauthorizedError = new Err(401, 'Unauthorized to review this product')

//expecting req.body to be an array of {leftoverId: 5, quantity: 10}
router.post('/', function(req, res, next) {
  if (!req.session.cart) req.session.cart = [];
  req.session.cart = req.body.cart;
  if (req.user) {
    persistCart(req.user.id, req.body.cart)
      .then(cart => {
        res.json(req.session.cart);
      })
  } else
    res.json(req.session.cart);
})

function persistCart(userId, cart) {
  return Order.createWithLeftovers({
    userId: userId
  }, cart, 'cart');
}

//serialized cart is an array of the form {leftoverId: 4, quantity: 10}
function deserializeCart(serializedCart) {
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
}

router.get('/', function(req, res, next) {
  if (req.user) res.json(req.user.cart);
  else
    deserializeCart(req.session.cart)
    .then(cart => {
      res.json(cart);
    })
    .catch(next);
})

