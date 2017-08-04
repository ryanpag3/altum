/**
 * Created by dev on 6/29/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Game = new Schema({
  name: String,
  short_name: { type: String, lowercase: true, unique: true },
  lobby_size: Number,
  ranks: [String],
  pic: String
});

module.exports = mongoose.model('games', Game, 'game_list');
