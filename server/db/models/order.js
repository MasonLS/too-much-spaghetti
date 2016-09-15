'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('order', {
    date: {
        type: Sequelize.DATE,
        validate: {
            isDate: true
        }
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // JOE: Seems like this relationship should be belongsToMany
    leftover_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
    }
});
