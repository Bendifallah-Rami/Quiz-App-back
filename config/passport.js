const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

// You will need to set these environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

// Log OAuth configuration for debugging
console.log('Google OAuth Config:');
console.log('Client ID exists:', !!GOOGLE_CLIENT_ID);
console.log('Client Secret exists:', !!GOOGLE_CLIENT_SECRET);
console.log('Callback URL:', GOOGLE_CALLBACK_URL);

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: ['profile', 'email']
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ where: { googleId: profile.id } });
      
      if (user) {
        // If user exists, return the user
        return done(null, user);
      }
      
      // Check if user exists with this email
      user = await User.findOne({ where: { email: profile.emails[0].value } });
      
      if (user) {
        // Link Google account to existing account
        user.googleId = profile.id;
        user.googleProfilePicture = profile.photos[0].value;
        user.authProvider = 'google';
        await user.save();
        return done(null, user);
      }
      
      // If no user exists, create a new one
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        googleProfilePicture: profile.photos[0].value,
        authProvider: 'google',
        isEmailVerified: true, // Google already verified the email
        verifiedAt: new Date()
      });
      
      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
