module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in to access this page');
    res.redirect('/auth/login');
  },

  isPatient: (req, res, next) => {
    console.log('User role:', req.user?.role);  
    
    if (req.user && req.user.role === 'patient') {
      return next();
    }
    req.flash('error', 'Access denied');
    res.redirect('/');
  },

  isTherapist: (req, res, next) => {
    if (req.user && req.user.role === 'therapist') {
      return next();
    }
    req.flash('error', 'Access denied');
    res.redirect('/');
  },

  forwardAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    if (req.user.role === 'patient') {
      res.redirect('/patient/dashboard');
    } else {
      res.redirect('/therapist/dashboard');
    }
  }
  
};