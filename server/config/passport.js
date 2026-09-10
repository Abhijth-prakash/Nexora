const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const config = require("./config");

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: "http://localhost:8888/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);

        // 1. Find user using Google ID
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (user) {
          return done(null, user);
        }

        // 2. Check whether email already exists
        user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (user) {
          user.googleId = profile.id;

          await user.save();

          return done(null, user);
        }

        // 3. Create new Google user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          verified: true,
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;