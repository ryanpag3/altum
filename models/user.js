/**
 * Created by dev on 6/19/2017.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  username: String, // unique
  password: String,
  email:    String
});

