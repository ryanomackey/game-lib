'use strict';

var express = require('express');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.session.id) {
    knex('user_games')
    .where('user_id',req.session.id)
    .leftJoin('games','games.id','user_games.game_id')
    .leftJoin('platforms', 'platforms.id','games.platform_id')
    .orderBy('title','ASC')
    .then(function(results) {
      var platforms = {};
      for (var i = 0; i < results.length; i++) {
        platforms[results[i].name] = results[i].platform_id;
      }
      res.render('index',{games:results, platforms:platforms, session:req.session});
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
