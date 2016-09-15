'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('order_leftover', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
});

