'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('cuisine', {
    // JOE: I think this column name is confusing.
    cuisine: {
        type: Sequelize.STRING
    }
});
