/**
 * Created by dev on 6/29/2017.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Games = require('../models/game.js');

router.get('/get', function(req, res) {
  Games.find({}, function(err, docs){
    // if error thrown
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    // success
    return res.status(200).json({
      docs: docs // query response documents
    });
  });
});

router.get('/get-names', function(req, res) {
  Games.find({}, 'name', function (err, docs) {
    // if error thrown
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    // success
    return res.status(200).json({
      docs: docs // query response documents
    });
  });
});

module.exports = router;
