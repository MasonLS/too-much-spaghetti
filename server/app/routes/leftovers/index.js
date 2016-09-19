'use strict'

const express = require('express');
const router = new express.Router();
const Leftover = require('../../../db/models/leftover');
const Cuisine = require('../../../db/models/cuisine');
const Review = require('../../../db/models/review')
const _ = require('lodash');

module.exports = router;

router.get('/', function(req, res, next) {
  Leftover.findAll()
    .then(function(leftovers) {
      res.send(leftovers);
    })
    .catch(next)
});


router.get('/featured', function(req, res, next) {
  Leftover.findAll({
      limit: 100
    })
    .then(function(leftovers) {
      let sortedLeftovers = leftovers.sort((a, b) => {
        return b.rating - a.rating;
      });
      res.json(_.shuffle(sortedLeftovers.slice(0, 5)));
    })
    .catch(next);
})

router.get('/:userId', function(req, res, next) {
  Leftover.findById(req.params.userId)
    .then(function(leftover) {
      res.send(leftover)
    })
    .catch(next);
});

router.post('/', function(req, res, next) {
  if (!req.user.isAdmin) next(new Error('Unauthorized'));
  let leftoverObj = req.body.leftoverObj,
    cuisineNames = req.body.cuisineNames;
  Leftover.createWithCuisines(leftoverObj, cuisineNames, req.user.id)
    .then((createdLeftover) => {
      res.status(201).json(createdLeftover);
    })
    .catch(next);
})

router.put('/', function(req, res, next) {
  if (!req.user.isAdmin) next(new Error('Unauthorized'));
  let leftoverObj = req.body.leftoverObj,
    cuisineNames = req.body.cuisineNames;
  Leftover.createWithCuisines(leftoverObj, cuisineNames)
    .then(_ => {
      res.status(201).json(leftoverObj);
    })
    .catch(next);
});

router.get('/:id/reviews', function(req, res, next) {
  Review.findAll({
    where: {
      leftoverId: req.params.id
    }
  })
  .then(function(reviews) {
    res.send(reviews);
  })
  .catch(next);
});

// /leftovers/:id
// /cuisine/:id
// /cuisine/id/leftovers
