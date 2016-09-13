'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const User = require('../../../db/models/user');
const _ = require('lodash');
const bodyParser = require('body-parser');

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

router.param('id', function(req, res, next, id) {
    User.findById(id)
    .then(function(user) {
        req.user = user;
        next();
    })
    .catch(next);
});

router.get('/', function(req, res, next) {
    User.findAll({})
    .then(function(users) {
        res.send(users);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
    if (!req.user) {
        res.sendStatus(404);
    }
    res.json(req.user);
});

router.post('/', function(req, res, next) {
    User.create(req.body)
    .then(function(user) {
        res.status(201).send(user);
    })
    .catch(next);
});

router.delete('/:id', function(req, res, next) {
    User.destroy({
        where: {
            id: req.user.id
        }
    })
    .then(function(user) {
        if (user === 0) {
            return res.status(404).end();
        }
    })
    .then(function(deletedUser) {
        res.status(204).send(deletedUser);
    })
    .catch(next);
});

router.put('/:id', function(req, res, next) {
    req.user.update(req.body)
    .then(function(user) {
        res.send(user);
    })
    .catch(next);
});

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/secret-stash', ensureAuthenticated, function (req, res) {

    var theStash = [
        'http://ep.yimg.com/ay/candy-crate/bulk-candy-store-2.gif',
        'http://www.dailybunny.com/.a/6a00d8341bfd0953ef0148c793026c970c-pi',
        'http://images.boomsbeat.com/data/images/full/44019/puppy-wink_1-jpg.jpg',
        'http://p-fst1.pixstatic.com/51071384dbd0cb50dc00616b._w.540_h.610_s.fit_.jpg',
        'http://childcarecenter.us/static/images/providers/2/89732/logo-sunshine.png',
        'http://www.allgraphics123.com/ag/01/10683/10683.jpg',
        'http://img.pandawhale.com/post-23576-aflac-dancing-duck-pigeons-vic-RU0j.gif',
        'http://www.eveningnews24.co.uk/polopoly_fs/1.1960527.1362056030!/image/1301571176.jpg_gen/derivatives/landscape_630/1301571176.jpg',
        'http://media.giphy.com/media/vCKC987OpQAco/giphy.gif',
        'https://my.vetmatrixbase.com/clients/12679/images/cats-animals-grass-kittens--800x960.jpg',
        'http://www.dailymobile.net/wp-content/uploads/2014/10/lollipops.jpg'
    ];

    res.send(_.shuffle(theStash));

});

router.use('/:id/orders', require('./orders'));
router.use('/:id/leftovers', require('./leftovers'));
