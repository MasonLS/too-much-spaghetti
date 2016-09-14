const express = require('express');
const router = express.Router();
module.exports = router;

const databaseUtils = require('../../../db');
const db = databaseUtils.db;
const Order = db.model('order');

router.get('/', function(req, res, next){
  Order.findAll({
    where: {
      userId: req.user.id
    }
  })
  .then(orders => res.json(orders))
  .catch(next);
});

router.post('/', function(req, res, next){
  Order.create(req.body)
    .then(order => {
      res.json(order);
    })
    .catch(next);
});

router.param('id', function(req, res, next, id){
  Order.findById(id)
    .then(order => {
      if (order) {
        req.order = order;
        next();
      } else {
        next(new Error('No such order!'));
      }
    })
    .catch(next);
});

router.get('/:id', function(req, res, next){
  if (req.order) {
    res.json(req.order);
  } else {
    next(new Error('No such order'));
  }
});

router.put('/:id', function(req, res, next){
  if (req.order.status !== 'complete') {
    req.order.updateAttributes(req.body)
      .then(order => res.json(order))
      .catch(next);
  } else {
    next(new Error('Cannot edit an order that has already been completed'));
  }
});

router.delete('/:id', function(req, res, next){
  req.order.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});
