/**
 * Created by Tyler on 29-Jun-17.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.js');

router.get('/list', function(req, res) {
  User.find({'username' : req.user.username }, { _id : 0, notifications :1}, function(err, docs) {
    if(err)
    {
      return res.status(500).json({err : err});
    }

    return res.status(200).json({docs : docs});
  });
});


router.post('/friend', function(req, res)
  {
    User.updateOne({'username' : req.user.username}, {$push: {friends_list : 'a'}}, function(err)
      {
        if (err)
        {
          console.log(err.message);
          return res.status(500).json({msg: err});
        }
        return res.status(200);
      }

    )
  }
);


module.exports = router;
