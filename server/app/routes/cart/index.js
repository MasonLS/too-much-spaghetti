'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Order = require('../../../db/models/order');
const Review = require('../../../db/models/review');
const User = require('../../../db/models/user');
const Leftover = require('../../../db/models/leftover');
const Err = require('../utils/err').gen;
const updateCart = require('../utils/cartUpdate').update;
const deleteCartElem = require('../utils/cartUpdate').delete;
const createCartInDb = require('../utils/cartUpdate').createCartInDb;
const updateCartElemInDb = require('../utils/cartUpdate').updateCartElemInDb;
const deleteCartElemInDb = require('../utils/cartUpdate').deleteCartElemInDb;
const deserializeCart = require('../utils/cartUpdate').deserializeCart;
const serializeCart = require('../utils/cartUpdate').serializeCart;
const isEmpty = require('../utils/cartUpdate').isEmpty;
const Promise = require('bluebird');

let unauthorizedError = new Err(401, 'Unauthorized to review this product')

//expecting req.body to be an array of {leftoverId: 5, quantity: 10}
router.post('/', function(req, res, next) {
  if (!req.session.cart) req.session.cart = [];
  req.session.cart = req.body.cart;
  if (req.user) {
    createCartInDb(req.user.id, req.body.cart)
      .then(cart => {
        res.json(req.session.cart);
      })
      .catch(next)
  } else
    res.json(req.session.cart);
})

//expecting req.body to be of form {leftoverId: 5, quantity: 10}
router.put('/', function(req, res, next) {
  if (!req.session.cart) req.session.cart = [];
  if (isEmpty(req.session.cart) && req.user) req.session.cart = serializeCart(req.user.cart);
  req.session.cart = updateCart(req.session.cart, req.body);
  if (req.user) {
    updateCartElemInDb(req.user.cart[0].orderId, req.body)
      .then(cart => {
        res.json(req.session.cart);
      })
      .catch(next)
  } else
    res.json(req.session.cart);
})

//expecting req.body to be of form {leftoverId: 5}
router.delete('/', function(req, res, next) {
  req.session.cart = deleteCartElem(req.session.cart, req.body.leftoverId);
  if (req.user) {
    deleteCartElemInDb(req.user.cart[0].orderId, req.body.leftoverId)
      .then(cart => {
        res.json(req.session.cart);
      })
      .catch(next)
  } else
    res.json(req.session.cart);
})

router.get('/', function(req, res, next) {
  if (req.user) {
    req.session.cart = serializeCart(req.user.cart);
    res.json(req.user.cart);
  } else
    deserializeCart(req.session.cart)
    .then(cart => {
      res.json(cart);
    })
    .catch(next);
})

