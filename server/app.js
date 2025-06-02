const express = require('express');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');

const passport = require('passport');
const passportConfig = require('./config/passport-config'); // Import the passport configuration file

const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:4200', // Angular frontend URL
  credentials: true, // Allow cookies
}));

app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Use `true` for HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Login Route
app.post('/api/login', passport.authenticate('local', { failureRedirect: '' }), (req, res) => {
  res.json({ message: 'Login successful' });
});


// Protected Route
app.get('/api/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: 'Authorized' });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
})

// Logout Route
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ message: 'Logged out' });
  });
});

// Routes
app.use('/api/events', eventRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
