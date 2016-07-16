'use strict';

var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

router.use(function(req,res,next) {
  if (req.session.id) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/:userId/games/:gameId', function(req, res) {
  knex('games').where('id',req.params.gameId)
  .then(function(game) {
    return knex('platforms').where('id',game[0].platform_id)
    .then(function(platform) {
      return knex('user_games').where({
        user_id:req.params.userId,
        game_id:req.params.gameId
      })
      .then(function(userSettings) {
        res.render('user_game',{
          game:game[0],
          platform:platform[0],
          userSettings: userSettings[0],
          session:req.session
        });
      });
    });
  });
});

router.get('/:userId/games/:gameId/toggle_own', function(req, res) {
  if (Number(req.session.id) === Number(req.params.userId)) {
    knex('user_games').where ({
      user_id:req.params.userId,
      game_id:req.params.gameId
    })
    .then(function(results) {
      if(results[0].own) {
        return knex('user_games').where ({
          user_id:req.params.userId,
          game_id:req.params.gameId
        })
        .update('own',false)
        .then(function() {
          res.redirect('/users/' + req.params.userId + '/games/' + req.params.gameId);
        });
      } else {
        return knex('user_games').where ({
          user_id:req.params.userId,
          game_id:req.params.gameId
        })
        .update('own',true)
        .then(function() {
          res.redirect('/users/' + req.params.userId + '/games/' + req.params.gameId);
        });
      }
    });
  } else {
    res.redirect('/');
  }
});

router.get('/:userId/games/:gameId/toggle_played', function(req, res) {
  if (Number(req.session.id) === Number(req.params.userId)) {
    knex('user_games').where ({
      user_id:req.params.userId,
      game_id:req.params.gameId
    })
    .then(function(results) {
      if(results[0].played) {
        return knex('user_games').where ({
          user_id:req.params.userId,
          game_id:req.params.gameId
        })
        .update('played',false)
        .then(function() {
          res.redirect('/users/' + req.params.userId + '/games/' + req.params.gameId);
        });
      } else {
        return knex('user_games').where ({
          user_id:req.params.userId,
          game_id:req.params.gameId
        })
        .update('played',true)
        .then(function() {
          res.redirect('/users/' + req.params.userId + '/games/' + req.params.gameId);
        });
      }
    });
  } else {
    res.redirect('/');
  }
});

router.post('/:userId/games/:gameId', function(req, res) {
  if (Number(req.session.id) === Number(req.params.userId)) {
    knex('user_games').where({
      user_id: req.params.userId,
      game_id: req.params.gameId
    })
    .then(function(results) {
      if (results.length === 0) {
        return knex('user_games').insert({
          user_id: req.params.userId,
          game_id: req.params.gameId,
          own: false,
          played: false
        })
        .then(function() {
          res.redirect('/');
        });
      } else {
          res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

router.delete('/:userId/games/:gameId', function(req, res) {
  if (Number(req.session.id) === Number(req.params.userId)) {
    knex('user_games').where({
      user_id:req.params.userId,
      game_id:req.params.gameId
    })
    .del()
    .then(function() {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
