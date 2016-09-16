'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

const db = require('../../../db');
const Leftover = db.model('leftover');
const User = db.model('user');


router.get('/sellers', function(req, res, next) {
  User.findAll({
      where: {
        isSeller: true
      }
    })
    .then(function(sellers) {
      res.send(sellers);
    })
    .catch(next);
});

router.post('/', function(req, res, next) {
  User.create(req.body)
    .then(function(user) {
      res.status(201).send(user);
    })
    .catch(next);
});


router.get('/', function(req, res, next) {
  if (req.user.isAdmin) {
    User.findAll()
      .then(function(users) {
        res.send(users);
      })
      .catch(next);
  } else {
    let err = new Error('Unauthorized');
    err.status = 401;
    next(err);
  }
});

router.param('id', function(req, res, next, id) {
  User.findById(id)
    .then(function(user) {
      req.userSought = user;
      next();
    })
    .catch(next);
});

router.get('/:id/leftovers', function(req, res, next) {
  Leftover.findAll({
      where: {
        chefId: req.userSought.id
      }
    })
    .then(leftovers => res.json(leftovers))
    .catch(next);
});

router.use('/:id', function(req, res, next){
  if (req.user.id !== req.userSought.id && !req.user.isAdmin) {
    let err = new Error('Unauthorized');
    err.status = 401;
    next(err);
  } else next();
});

router.get('/:id', function(req, res, next) {
  res.send(req.userSought);
});

router.delete('/:id', function(req, res, next) {
  req.userSought.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

router.put('/:id', function(req, res, next) {
  req.user.update(req.body)
    .then(function(user) {
      res.send(user);
    })
    .catch(next);
});

router.use('/:id/orders', require('./orders'));
router.use('/:id/leftovers', require('./leftovers'));
