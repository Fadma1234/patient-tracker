const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');
const { isAuthenticated, isPatient } = require('../middleware/auth');

// All routes require authentication and patient role
router.use(isAuthenticated, isPatient);

// Dashboard
router.get('/dashboard', patientController.getDashboard);

// Exercises
router.get('/exercises', patientController.getExercises);
router.get('/exercises/:id', patientController.getExerciseDetail);
router.post('/exercises/:id/log', patientController.logExercise);

// Progress
router.get('/progress', patientController.getProgress);

// Reminders
router.get('/reminders', patientController.getReminders);
router.post('/reminders', patientController.createReminder);
router.delete('/reminders/:id', patientController.deleteReminder);

module.exports = router;