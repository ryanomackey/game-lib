'use strict';

var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

router.get('/search', function(req, res) {
  knex('games').where('title','like','%' + req.query.search + '%')
  .then(function(data) {
    res.render('search', {games:data,session:req.session});
  });
});

router.get('/new', function(req, res) {
  if (req.session.is_admin) {
    knex('platforms').orderBy('name','ASC').then(function(data) {
      res.render('new_game', {platforms:data,session:req.session});
    });
  } else {
    res.redirect('/');
  }
});

router.get('/:id', function(req, res) {
  knex('games').where('id',req.params.id)
  .then(function(data) {
    return knex('platforms').where('id', data[0].platform_id)
    .then(function(platform) {
      res.render('game', {game:data[0], platform: platform[0], session:req.session});
    });
  });
});

router.put('/:id', function(req, res) {
  if (req.session.is_admin) {
    if (req.body.indie === undefined) {
      req.body.indie = false;
    }
    knex('games')
    .where('id',req.params.id)
    .update({
      title: req.body.title,
      image_url: req.body.image_url,
      platform_id: req.body.platform_id,
      release_year: req.body.release_year,
      metacritic: req.body.metacritic,
      length: req.body.length,
      description: req.body.description,
      indie: req.body.indie
    }).then(function() {
      res.redirect('/games/' + req.params.id);
    });
  } else {
    res.redirect('/');
  }
});

router.get('/:id/edit', function(req, res) {
  if (req.session.is_admin) {
    knex('games').where('id',req.params.id)
    .then(function(data) {
      return knex('platforms')
      .then(function(platforms) {
        res.render('edit_game', {game:data[0], platforms: platforms, session:req.session});
      });
    });
  } else {
    res.redirect('/');
  }
});

router.post('/', function(req, res) {
  if (req.session.is_admin) {
    if (req.body.indie === undefined) {
      req.body.indie = false;
    }
    knex('games').insert({
      title: req.body.title,
      image_url: req.body.image_url,
      platform_id: req.body.platform_id,
      release_year: req.body.release_year,
      metacritic: req.body.metacritic,
      length: req.body.length,
      description: req.body.description,
      indie: req.body.indie
    }).then(function() {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
