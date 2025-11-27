const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { forwardAuthenticated } = require('../middleware/auth');
const passport = require('passport');

// Home
router.get('/', (req, res) => res.render('index.ejs'));

// Login
router.get('/login', forwardAuthenticated, authController.getLogin);
router.post('/login', (req, res, next) => {

  next();
},
  passport.authenticate('local', {
    successRedirect: '/patient/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

// Signup
router.get('/signup', forwardAuthenticated, authController.getSignup);
router.post('/signup', authController.postSignup);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
