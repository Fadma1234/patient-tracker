const User = require('../models/User');
const Exercise = require('../models/Exercise');
const ExercisePlan = require('../models/ExercisePlan');
const ExerciseLog = require('../models/ExerciseLog');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.getDashboard = async (req, res) => {
  try {
    const patients = await User.find({ 
      therapistId: req.user.id,
      role: 'patient'
    });

    res.render('therapist/dashboard', { patients });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ 
      therapistId: req.user.id,
      role: 'patient'
    });

    res.render('therapist/patients', { patients });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading patients');
    res.redirect('/therapist/dashboard');
  }
};

exports.getPatientDetail = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    const activePlan = await ExercisePlan.findOne({
      patientId: req.params.id,
      status: 'active'
    }).populate('exercises.exerciseId');

    const logs = await ExerciseLog.find({ patientId: req.params.id })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate('exerciseId');

    res.render('therapist/patient-detail', { patient, activePlan, logs });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading patient');
    res.redirect('/therapist/patients');
  }
};

exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ 
      createdBy: req.user.id 
    }).sort({ createdAt: -1 });

    res.render('therapist/exercises', { exercises });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading exercises');
    res.redirect('/therapist/dashboard');
  }
};

exports.getExerciseForm = async (req, res) => {
  try {
    let exercise = null;
    if (req.params.id) {
      exercise = await Exercise.findById(req.params.id);
    }
    res.render('therapist/exercise-form', { exercise });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading form');
    res.redirect('/therapist/exercises');
  }
};
exports.createPlan = async (req, res) => {
  try {
    const { patientId, endDate, exercises } = req.body;

    // Deactivate any existing active plans for this patient
    await ExercisePlan.updateMany(
      { patientId: patientId, status: 'active' },
      { status: 'completed' }
    );

    // Create new plan
    await ExercisePlan.create({
      patientId: patientId,
      therapistId: req.user.id,
      exercises: exercises,
      endDate: endDate || null,
      status: 'active'
    });

    req.flash('success', 'Exercise plan created successfully!');
    res.redirect('/therapist/patients/' + patientId);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error creating plan');
    res.redirect('/therapist/patients');
  }
};

exports.createExercise = async (req, res) => {
  try {
    const { name, description, instructions, category, difficulty } = req.body;
    
    const exerciseData = {
      name,
      description,
      instructions: instructions.split('\n').filter(i => i.trim()),
      category,
      difficulty,
      createdBy: req.user.id
    };

    // Handle file uploads if present
    if (req.files) {
      if (req.files.video) {
        // Upload video to Cloudinary
        const videoUpload = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'video', folder: 'exercises' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.files.video[0].buffer).pipe(stream);
        });
        exerciseData.videoUrl = videoUpload.secure_url;
      }

      if (req.files.image) {
        // Upload image to Cloudinary
        const imageUpload = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'exercises' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.files.image[0].buffer).pipe(stream);
        });
        exerciseData.imageUrl = imageUpload.secure_url;
      }
    }

    await Exercise.create(exerciseData);

    req.flash('success', 'Exercise created successfully!');
    res.redirect('/therapist/exercises');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error creating exercise');
    res.redirect('/therapist/exercise-form');
  }
};
exports.deleteExercise = async (req, res) => {
    console.log('Delete route hit, id:', req.params.id);  
  try {
    const exercise = await Exercise.findById(req.params.id);
    console.log('Exercise found:', exercise);  
    if (!exercise) {
      req.flash('error', 'Exercise not found');
      return res.redirect('/therapist/exercises');
    }
    
    // Make sure therapist owns this exercise
    if (exercise.createdBy.toString() !== req.user.id) {
      req.flash('error', 'Not authorized');
      return res.redirect('/therapist/exercises');
    }
    
    await Exercise.findByIdAndDelete(req.params.id);
    
    req.flash('success', 'Exercise deleted successfully');
    res.redirect('/therapist/exercises');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error deleting exercise');
    res.redirect('/therapist/exercises');
  }
};

exports.getPlanForm = async (req, res) => {
  try {
    const patient = await User.findById(req.params.patientId);
    const exercises = await Exercise.find({ createdBy: req.user.id });

    res.render('therapist/plan-form', { patient, exercises });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading form');
    res.redirect('/therapist/patients');
}
};
exports.getUnassignedPatients = async (req, res) => {
  try {
    const unassignedPatients = await User.find({ 
      role: 'patient',
      therapistId: { $exists: false }
    });
    
    res.render('therapist/unassigned-patients', { patients: unassignedPatients });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading patients');
    res.redirect('/therapist/dashboard');
  }
};

exports.assignPatient = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.patientId, {
      therapistId: req.user.id
    });
    
    req.flash('success', 'Patient assigned successfully');
    res.redirect('/therapist/patients');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error assigning patient');
    res.redirect('/therapist/unassigned-patients');
  }
};

exports.unassignPatient = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.patientId, {
      $unset: { therapistId: 1 }
    });
    
    req.flash('success', 'Patient unassigned');
    res.redirect('/therapist/patients');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error unassigning patient');
    res.redirect('/therapist/patients');
  }
};
exports.deletePlan = async (req, res) => {
  try {
    const plan = await ExercisePlan.findById(req.params.planId);
    
    if (!plan) {
      req.flash('error', 'Plan not found');
      return res.redirect('/therapist/patients');
    }
    
    // Make sure therapist owns this plan
    if (plan.therapistId.toString() !== req.user.id) {
      req.flash('error', 'Not authorized');
      return res.redirect('/therapist/patients');
    }
    
    const patientId = plan.patientId;
    
    // Delete the plan
    await ExercisePlan.findByIdAndDelete(req.params.planId);
    
    req.flash('success', 'Exercise plan deleted successfully');
    res.redirect('/therapist/patients/' + patientId);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error deleting plan');
    res.redirect('/therapist/patients');
  }
};