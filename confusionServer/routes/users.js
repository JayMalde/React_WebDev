const express = require('express');
const createError = require('http-errors');
const passport = require('passport');

const User = require('../models/user');
const authenticate = require('../authenticate');

const router = express.Router();

router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => 
{
  User.find({}).then(users => res.json(users), err => next(err));
});

router.post('/signup', (req, res) => 
{
  User.register(new User({ username: req.body.username }), req.body.password,
      (err, user) => 
      {
        if (err) {
          res.status(500).json({ err: err });
        } else {
          if (req.body.firstname) {
            user.firstname = req.body.firstname;
          }
          if (req.body.lastname) {
            user.lastname = req.body.lastname;
          }
          user.save((err, user) => {
            if (err) {
              res.status(500).json({ err: err });
            } else {
              passport.authenticate('local')(req, res, () => {
                res.json({ success: true, status: 'Registration Successful!' });
              });
            }
          });
        }
      });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    next(createError(403, 'You are not logged in!'));
  }
});

module.exports = router;