'use strict';
var crypto = require('crypto');
var _ = require('lodash');
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
    leftover_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
});
