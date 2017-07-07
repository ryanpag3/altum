/**
 * Created by dev on 6/19/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  password: String,
  email:    String,
  // add during registration page update
  // steamUsername: String,
  // xboxUsername: String,
  // psUsername: String,
  // nintendoUsername: String
});
// for more info on what this plugin does
// see ref: https://github.com/saintedlama/passport-local-mongoose#api-documentation
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('dsers', User);

