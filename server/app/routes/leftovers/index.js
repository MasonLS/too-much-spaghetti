'use strict'

const express = require('express');
const router = new express.Router();
const Leftover = require('../../../db/models/leftover');
const Cuisine = require('../../../db/models/cuisine');

module.exports = router;

router.get('/', function(req, res, next) {
  Leftover.findAll()
    .then(function(leftovers) {
      res.send(leftovers);
    })
    .catch(next)
})

router.get('/:id', function(req, res, next) {
  Leftover.findById(req.params.id)
    .then(function(leftover) {
      res.send(leftover)
    })
    .catch(next);
})

router.post('/', function(req, res, next) {
  if (!req.user.isAdmin) next(new Error('Unauthorized'));
  let leftoverObj = req.body.leftoverObj,
    cuisineNames = req.body.cuisineNames;
  Leftover.createWithCuisines(leftoverObj, cuisineNames)
    .then(_ => {
      res.status(201).json(leftoverObj);
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
})

// /leftovers/:id
// /cuisine/:id
// /cuisine/id/leftovers

