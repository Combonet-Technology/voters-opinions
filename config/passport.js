const mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require('../models/User');

module.exports = function (passport){
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // }
    // );
  }));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => user.findById(id, (err, user) => done(err, user)));
};