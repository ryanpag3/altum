/**
 * Created by dev on 6/29/2017.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Games = require('../models/game.js');

router.get('/list', function(req, res) {
  Games.find({}, 'game' , function(err, docs){
    console.log(docs.length);
    for (var i = 0; i < docs.length; i++){
      console.log(docs[i].game);
    }
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
