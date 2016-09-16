'use strict';

const express = require('express');
const router = express.Router();
module.exports = router;

const db = require('../../../db');
const Order = db.model('order');


router.post('/', function(req, res, next) {
  let orderObj = req.body.orderObj,
      leftoversArr = req.body.leftoversArr;

  Order.createWithLeftovers(orderObj, leftoversArr)
    .then(_ => {
      res.json('Order created');
    })
    .catch(next);
});

router.put('/:id', function(req, res, next) {

  Order.findById(req.params.id)
    .then(order => {
      if (order.status !== 'complete') {
        return order.update(req.body)
      }
      let err = new Error('Cannot edit an order that has been completed');
      err.status = 403;
      throw err;
    })
    .then(order => res.json(order))
    .catch(next);
});
