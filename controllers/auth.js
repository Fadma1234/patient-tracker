const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',   // or your desired page
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
};

exports.getSignup = (req, res) => {
  res.render('auth/signup');
};

exports.postSignup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/signup');
    }

    // Create user - let the pre-save hook handle hashing
    await User.create({
      email: email.toLowerCase(),
      password: password,  // <-- Plain password, NOT hashed
      role: role,
      profile: {
        firstName: firstName,
        lastName: lastName
      }
    });

    req.flash('success', 'Account created successfully! Please log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error creating account');
    res.redirect('/auth/signup');
  }
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/auth/login');
  });
};