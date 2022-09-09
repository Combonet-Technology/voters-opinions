const express = require('express');
const passport = require('passport');

const router = express.Router();
// @desc Google auth page
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//google auth callback /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' , successRedirect: '/dashboard'}));

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); }
    res.redirect('/');
  });
});

module.exports = router;