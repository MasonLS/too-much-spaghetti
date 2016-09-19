'use strict';

const Sequelize = require('sequelize');
const db = require('../_db');
const Leftover = require('./leftover');

const options = {},
  hooks = {
    afterCreate: function(createdReview) {
      return Leftover.findById(createdReview.leftoverId, {
          include: [createdReview.Model]
        })
        .then(leftover => {
          let avgRating = Math.round(leftover.reviews.reduce((prev, curr) => prev + curr.stars, 0) / leftover.reviews.length);
          return leftover.update({
            rating: avgRating
          })
        })
    }
  };

options.hooks = hooks;

module.exports = db.define('review', {
  stars: {
    type: Sequelize.INTEGER
  },
  body: {
    type: Sequelize.TEXT
  }
}, options);

