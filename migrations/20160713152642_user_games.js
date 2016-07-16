'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('user_games', function(table){
    table.integer('game_id');
    table.integer('user_id');
    table.boolean('own');
    table.boolean('played');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_games');
};
