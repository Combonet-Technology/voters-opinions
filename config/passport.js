const mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport){
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    const newUser = {
      'googleId':profile.id,
      'displayName': profile.displayName,
      'firstName': profile._json['given_name'],
      'lastName': profile._json['family_name'],
      'image': profile._json['picture']
    }
    // User.findOrCreate({ googleId: profile.id }, function (err, newUser) {
    //   return cb(err, user);
    // }
    // );
    try {
      let user = await User.findOne({'googleId':profile.id})
      if (user){
        cb(null, user)
      }
      else{
        user = User.create(newUser)
        cb(null, user)
      }
    } catch (err) {
      console.error(err)
    }
  }));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((user, done) => User.findById(user.id, (err, user) => done(err, user)));
};


// todo facebook and linkedin OAUTH2 and openID connect
// npm install passport-local
// npm install passport-openidconnect
