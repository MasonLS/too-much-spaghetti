'use strict'

const express = require('express');
const router = new express.Router();
const Leftover = require('../../../db/models/leftover');
const Cuisine = require('../../../db/models/cuisine');

module.exports = router;

router.get('/', function (req, res, next) {
    Cuisine.findAll()
        .then(function (cuisines) {
            res.send(cuisines);
        })
        .catch(next);
})

// JOE: Why cuisine text instead of cuisine's id?
router.get('/:cuisine', function (req, res, next) {

    Cuisine.findOne({
        where: req.params,
        include: [Leftover]
    })
        .then(function (cuisine) {
            res.send(cuisine.leftovers);
        })
        .catch(next);

    Cuisine.findOne({
        // JOE: cuisine column name confusion.
        where: {cuisine: req.params.cuisine}
    })
        .then(function (cuisine) {
            // JOE: There is a chance for eager loading to be used here.
            return cuisine.getLeftovers();
        })
        .then(function (cuisineLeftovers) {
            res.send(cuisineLeftovers);
        })
        .catch(next);
})
