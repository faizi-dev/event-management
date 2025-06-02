const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Sample Users for the example, replace with your database logic
const users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'admin', password: '12345' },
  { id: 3, username: 'admin', password: '123' }
];

// Passport Local Strategy for authentication
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username);
  if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
  }
  if (user.password !== password) {
    return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
}));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

module.exports = passport;
