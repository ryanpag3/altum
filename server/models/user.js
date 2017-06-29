/**
 * Created by dev on 6/19/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Notification = require('notificationschema.js');

var User = new Schema({
  username: String,
  password: String,
  email:    String,
  notifications: [Notification]
  //friends_list: [User] //cannot use recursive definition?
});
// for more info on what this plugin does
// see ref: https://github.com/saintedlama/passport-local-mongoose#api-documentation
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);

