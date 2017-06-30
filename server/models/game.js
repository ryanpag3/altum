/**
 * Created by dev on 6/29/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Game = new Schema({
  name: String,
  lobby_size: Number,
  ranks: [String]
});

module.exports = mongoose.model('games', Game, 'game_list');
