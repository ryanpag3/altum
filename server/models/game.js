/**
 * Created by dev on 6/29/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Game = new Schema({
  game: String,
  lobby_size: Number });

module.exports = mongoose.model('games', Game, 'game_list');
