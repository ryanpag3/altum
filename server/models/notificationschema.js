/**
 * Created by Tyler on 29-Jun-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema
({
  to_user: String,
  from_user: String,
  oid: ObjectId
});

module.exports = NotificationSchema;//export as a mongoose model?
