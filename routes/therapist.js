const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapist');
const { isAuthenticated, isTherapist } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication and therapist role
router.use(isAuthenticated, isTherapist);

// Dashboard
router.get('/dashboard', therapistController.getDashboard);

// Patients
router.get('/patients', therapistController.getPatients);
router.get('/patients/:id', therapistController.getPatientDetail);

// Exercises
router.get('/exercises', therapistController.getExercises);
router.get('/exercises/new', therapistController.getExerciseForm);
router.get('/exercises/:id/edit', therapistController.getExerciseForm);
router.post('/exercises', 
  upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
  therapistController.createExercise
);
router.delete('/exercises/:id', therapistController.deleteExercise);

// Plans
router.get('/plans/new/:patientId', therapistController.getPlanForm);
router.post('/plans', therapistController.createPlan);
router.delete('/plans/:planId', therapistController.deletePlan); 

// Patient Assignment
router.get('/unassigned-patients', therapistController.getUnassignedPatients);
router.post('/assign-patient/:patientId', therapistController.assignPatient);
router.post('/unassign-patient/:patientId', therapistController.unassignPatient);

module.exports = router;