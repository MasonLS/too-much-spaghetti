const express = require('express');
const router = express.Router();
module.exports = router;

const db = require('../../../db');
const Leftover = db.model('leftover');


router.get('/', function(req, res, next){
  Leftover.findAll({
    where: {
      chefId: req.user.id
    }
  })
  .then(leftovers => res.json(leftovers))
  .catch(next);
});

router.post('/', function(req, res, next){
  Leftover.create(req.body)
    .then(leftover => {
      res.status(201).json(leftover);
    })
    .catch(next);
});

router.param('id', function(req, res, next, id){
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

router.get('/:id', function(req, res, next){
  if (req.leftover) {
    res.json(req.leftover);
  } else {
    next(new Error('No such leftover'));
  }
});

router.put('/:id', function(req, res, next){
  req.leftover.updateAttributes(req.body)
    .then(leftover => res.json(leftover))
    .catch(next);
});

router.delete('/:id', function(req, res, next){
  req.leftover.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});
