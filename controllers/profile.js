const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
// const streamifier = require('streamifier');

exports.getProfile = async (req, res) => {
  try {
    res.render('shared/profile');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading profile');
    res.redirect('/');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Update basic info
    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    user.profile.phoneNumber = phoneNumber;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/profile');
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating profile');
    res.redirect('/profile');
  }
};





   
    