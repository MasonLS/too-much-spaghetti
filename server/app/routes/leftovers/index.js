'use strict'

const express = require('express');
const router = new express.Router();
const Leftover = require('../../../db/models/leftover');
const Cuisine = require('../../../db/models/cuisine');
const Review = require('../../../db/models/review');
const User = require('../../../db/models/user');
const _ = require('lodash');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAaxJXWyIlA6MMIfHtjeAia39sffgj5Vx8'
});
const Promise = require('Bluebird');

module.exports = router;

const gettingDistance = Promise.promisify(googleMapsClient.distanceMatrix);

router.get('/', function(req, res, next) {
  Leftover.findAll()
    .then(function(leftovers) {
      res.send(leftovers);
    })
    .catch(next)
});

// router.get('/', function(req, res, next) {
//   Leftover.findAll({
//     include: [{model: User, as: 'chef'}]
//   })
//     .then(function(leftovers) {
//       return Promise.map(leftovers, leftover => {
//         return gettingDistance({
//         origins: req.user.address,
//         destinations: leftover.chef.address,
//         units: 'imperial'
//       })
//         .then(response => {
//           leftover.distance = response.json.rows[0].elements[0].distance.text;
//           return leftover;
//         })
//         .catch(next);
//       });
//     })
//     .then(leftovers => {
//       let distances = leftovers.map(leftover => leftover.distance);
//       console.log(distances);
//       res.send(leftovers);
//     })
//     .catch(next)
// });

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

router.param('id', function(req, res, next){
  Leftover.findOne({
    where: {
      id: req.params.id
    },
    include: [{model: User, as: 'chef'}]
  })
    .then(leftover => {
      req.leftover = leftover;
      next();
    })
    .catch(next);
})

router.get('/:id', function(req, res, next) {
  res.json(req.leftover);
});

router.get('/:id/distance', function(req, res, next){
  googleMapsClient.distanceMatrix({
        origins: req.user.address,
        destinations: req.leftover.chef.address,
        units: 'imperial'
      }, (err, response) => {
        if (err) return next(err);
        let distance = response.json.rows[0].elements[0].distance.text;
        res.send({distance: distance});
      });
});

// router.get('/:id', function(req, res, next) {
//   Leftover.findOne({
//     where: {
//       id: req.params.id
//     },
//     include: [{model: User, as: 'chef'}]
//     })
//     .then(function(leftover) {
//       googleMapsClient.distanceMatrix({
//         origins: req.user.address,
//         destinations: leftover.chef.address,
//         units: 'imperial'
//       }, (err, response) => {
//         if (err) {console.log('ERROR'); return next(err);}
//         let distance = response.json.rows[0].elements[0].distance.text;
//         res.send({leftover: leftover, distance: distance});
//       });
//     })
//     .catch(next);
// });

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

router.get('/rating/:rating', function(req,res,next) {
  console.log(req.params.rating)
  Leftover.findAll({
    where: {
      rating: req.params.rating
    }
  })
  .then(function(leftovers){
    res.send(leftovers);
  })
  .catch(next);
});

// /leftovers/:id
// /cuisine/:id
// /cuisine/id/leftovers
