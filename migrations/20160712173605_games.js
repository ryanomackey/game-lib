'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('games', function(table){
    table.increments();
    table.string('title');
    table.string('image_url');
    table.boolean('indie');
    table.integer('metacritic');
    table.integer('release_year');
    table.integer('length');
    table.integer('platform_id');
    table.text('description');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('games');
};
