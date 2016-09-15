'use strict'

const express = require('express');
const router = new express.Router();
const Leftover = require('../../../db/models/leftover');
const Cuisine = require('../../../db/models/cuisine');

module.exports = router;

router.get('/', function (req, res, next) {
    Leftover.findAll()
        .then(function (leftovers) {
            res.send(leftovers);
        })
        .catch(next)
})

router.post('/', function (req, res, next) {

    Leftover.createWithCuisines(req.body)
        .then(function (createdLeftover) {
            res.send(createdLeftover);
        })
        .catch(next);

});

router.get('/:id', function (req, res, next) {
    // JOE: Be very strict about formatting!
    Leftover.findById(req.params.id)
        .then(function (leftover) {
            res.send(leftover)
        })
        .catch(next);
})


// /leftovers/:id
// /cuisine/:id
// /cuisine/id/leftovers
