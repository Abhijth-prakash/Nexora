const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const config = require('./config')
passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: "/auth/google/callback"
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);

                let user = await User.findOne({
                    googleId: profile.id
                });

                if (user) {
                    return done(null, user);
                }

                user = await User.findOne({
                    email: profile.emails[0].value
                });

                if (user) {
                    user.googleId = profile.id;

                    await user.save();

                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                });

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;