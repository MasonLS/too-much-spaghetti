'use strict';

const Sequelize = require('sequelize');
const db = require('../_db');
const Leftover = require('./leftover');

let options = {},
  hooks = {
    afterCreate: function(createdReview) {
      return Leftover.findById(createdReview.leftoverId)
        .then(leftover => {
          let avgRating = Math.round((leftover.rating + createdReview.stars) / 2);
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

