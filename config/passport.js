const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
  // Define the "local" strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      console.log('2. Passport strategy called');
      console.log('3. About to query DB for:', email);
      const user = await User.findOne({ email: email.toLowerCase() });
      console.log('4. DB query complete, user:', user ? 'found' : 'not found');
      console.log('4b. Stored password hash:', user?.password);  // <-- Add this line
      
      if (!user) {
        return done(null, false, { message: 'Email not registered' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log('5. Password match:', isMatch);
      
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      console.log('Error:', err);
      return done(err);
    }
  })
);
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
