var express = require('express');
var router = express.Router();
var Models = require("../models");
const crypto = require('crypto');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', {error : ""});
});

router.post('/login', function(req, res) {
	console.log("Login called")
	
  Models.User.findOne({ username: req.body.username }, function(err, user) {
    if (!user) {
      res.render('login', { error: 'Invalid username or password.' });
    } 
    else {
      const hash = crypto.createHash('sha256');
      hash.update(req.body.password + req.body.username); //password hashed and salted
      var password_hashed = hash.digest('hex');
      if (password_hashed === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/');
      } 
      else {
        res.render('login', { error: 'Invalid username or password.' });
      }
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
