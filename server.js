const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();
const passport = require('passport');
const flash = require('express-flash');

const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session & Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
// Global template variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.messages = req.flash ? req.flash() : {};
    next();
});
require('./config/passport')(passport);

// --- ROUTES ---
app.get('/', (req, res) => {
    res.render('index');  // or whatever your homepage file is called
});
app.use('/auth', require('./routes/auth'));


app.use('/patient', require('./routes/patient'));
app.use('/therapist', require('./routes/therapist'));
app.use('/messages', require('./routes/messages'));
app.use('/profile', require('./routes/profile'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('shared/error', { error: 'Page Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
