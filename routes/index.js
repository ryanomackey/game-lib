'use strict';

var express = require('express');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', function(req, res) {
  var platformRaw = 'platform_id is not null';
  var ownRaw = 'own is not null';
  var playedRaw = 'played is not null';
  var indieRaw = 'indie is not null';

  if (Number(req.query.platform) === 0) {
    platformRaw = 'platform_id is not null';
  } else if (req.query.platform) {
    platformRaw = 'platform_id = ' + req.query.platform;
  } else {
    platformRaw = 'platform_id is not null';
  }

  if(req.query.wishlist) {
    ownRaw = 'own = false';
  }

  if(req.query.unplayed) {
    playedRaw = 'played = false';
  }

  if(req.query.indie) {
    indieRaw = 'indie = true';
  }

  if (req.session.id) {
    knex('user_games')
    .where('user_id',req.session.id)
    .whereRaw(platformRaw)
    .whereRaw(ownRaw)
    .whereRaw(playedRaw)
    .whereRaw(indieRaw)
    .leftJoin('games','games.id','user_games.game_id')
    .leftJoin('platforms', 'platforms.id','games.platform_id')
    .orderBy('title','ASC')
    .then(function(games) {
      return knex('platforms').then(function(platforms) {
        res.render('index',{games:games, platforms:platforms, session:req.session, query:req.query});
      });
    });
  } else {
    res.redirect('/login');
  }

});

router.get('/login', function(req, res) {
  res.render('login', {error:null,session:req.session});
});

router.post('/login', function(req, res) {
  var email = req.body.email;
  knex('users').where('email', email.toLowerCase())
  .then(function(data) {
    bcrypt.compare(req.body.password, data[0].password, function(err, result) {
      if (result === true) {
        req.session.id = data[0].id;
        req.session.email = data[0].email;
        req.session.is_admin = data[0].is_admin;
        res.redirect('/');
      } else {
        res.render('login', {error:'Incorrect email or password.',session:req.session});
      }
    });
  })
  .catch(function() {
    res.render('login', {error:'Incorrect email or password',session:req.session});
  });
});

router.get('/logout', function(req, res) {
  if(req.session.id) {
    req.session = null;
  }
  res.redirect('/');
});

router.get('/new_account', function(req, res) {
  res.render('new_account',{error:null, session:req.session});
});

router.post('/new_account', function(req, res) {
  var email = req.body.email;
  knex('users').where('email', email.toLowerCase())
  .then(function(result) {
    if (result.length > 0) {
      res.render('new_account', {error:'Email already exists.',session:req.session});
    } else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        knex('users').insert({
          email: email.toLowerCase(),
          password: hash,
        }).then(function() {
          res.redirect('/login');
        });
      });
    }
  });
});

module.exports = router;
