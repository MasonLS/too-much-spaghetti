'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/users', require('./users'));
router.use('/leftovers', require('./leftovers'));
router.use('/cuisines', require('./cuisines'));
router.use('/orders', require('./orders'));
router.use('/review', require('./reviews'));

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
  res.status(404).end();
});
