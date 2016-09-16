'use strict';

const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('review', {
  stars: {
    type: Sequelize.INTEGER
  },
  body: {
    type: Sequelize.TEXT
  }
})
