const express = require('express');
const passport = require('passport');

const router = express.Router();
// @desc Google auth page
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

module.exports = router;