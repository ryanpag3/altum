/**
 * Created by dev on 6/29/2017.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Games = require('../models/game.js');

router.get('/list', function(req, res) {
  Games.find({}, function(err, docs) {
    console.log(docs);
  });
});

module.exports = router;
