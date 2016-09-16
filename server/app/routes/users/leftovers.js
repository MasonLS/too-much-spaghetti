const express = require('express');
const router = express.Router();
module.exports = router;

const db = require('../../../db');
const Leftover = db.model('leftover');

//Expects req.body to have a leftoverObj and a cusinesNames array
//does leftoverObj have a user/chefId?
router.post('/', function(req, res, next) {
  let leftoverObj = req.body.leftoverObj,
    cuisineNames = req.body.cuisineNames;
  Leftover.createWithCuisines(leftoverObj, cuisineNames)
    .then(_ => {
      res.status(201).json(leftoverObj);
    })
    .catch(next);
});

router.param('id', function(req, res, next, id) {
  Leftover.findById(id)
    .then(leftover => {
      if (leftover) {
        req.leftover = leftover;
        next();
      } else {
        next(new Error('No such leftover!'));
      }
    })
    .catch(next);
});

router.put('/:id', function(req, res, next) {
  req.leftover.updateAttributes(req.body)
    .then(leftover => res.json(leftover))
    .catch(next);
});

router.delete('/:id', function(req, res, next) {
  req.leftover.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});
