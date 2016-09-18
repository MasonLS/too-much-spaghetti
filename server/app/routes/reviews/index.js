'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Order = require('../../../db/models/order');
const Review = require('../../../db/models/review');
const Leftover = require('../../../db/models/leftover');
const Err = require('../utils/err').gen;

let unauthorizedError = new Err(401, 'Unauthorized to review this product')

router.use(function(req, res, next) {
  if (!req.user) next(unauthorizedError)
  else next();
})

router.post('/', function(req, res, next) {
  console.log('GETTING HERE');
  let {
    leftoverId,
    body,
    stars
  } = req.body, userId = req.user.id;
  Order.findAll({
      where: {
        buyerId: userId
      },
      include: [Leftover]
    })
    .then(orders => {
      let leftovers = orders.map(or => or.leftover);
      if (leftovers.some(leftover => leftover.id === leftoverId) || req.user.isAdmin) {
        return Review.create({
            leftoverId: leftoverId,
            body: body,
            stars: stars,
            userId: userId
          })
          .then(function(_) {
            res.status(200).json('Review posted');
          })
      } else {
        next(unauthorizedError);
      }
    })
})

