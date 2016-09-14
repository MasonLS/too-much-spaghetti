'use strict';
var db = require('./_db');
module.exports = db;
// eslint-disable-next-line no-unused-vars
var User = require('./models/user');
var Cuisine = require('./models/cuisine');
var Leftover = require('./models/leftover');
var Order = require('./models/order');

Leftover.belongsTo(User, {as: "chef"});
Order.belongsTo(User);
Cuisine.belongsToMany(Leftover, {through: "cuisine_leftover"});
Leftover.belongsToMany(Cuisine, {through: "cuisine_leftover"});



// if we had more models, we could associate them in this file
// e.g. User.hasMany(Reports)
