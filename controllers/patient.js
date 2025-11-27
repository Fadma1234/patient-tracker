const ExercisePlan = require('../models/ExercisePlan');
const ExerciseLog = require('../models/ExerciseLog');
const Exercise = require('../models/Exercise');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    let therapist = null;
    if (req.user.therapistId) {
      therapist = await User.findById(req.user.therapistId);
    }

    const activePlan = await ExercisePlan.findOne({
      patientId: req.user.id,
      status: 'active'
    }).populate('exercises.exerciseId');

    const recentLogs = await ExerciseLog.find({ patientId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('exerciseId');

    // Check for active reminders that should notify today
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = today.toTimeString().slice(0, 5); // HH:MM format
 
    
    const dueReminders = await Reminder.find({
      patientId: req.user.id,
      isActive: true,
      days: dayName
    });

    

    // Filter reminders that are due (time has passed today and haven't been notified today)
    const notificationsToShow = dueReminders.filter(reminder => {
      const reminderTimeParts = reminder.time.split(':');
      const reminderHour = parseInt(reminderTimeParts[0]);
      const reminderMinute = parseInt(reminderTimeParts[1]);
      
      const currentTimeParts = currentTime.split(':');
      const currentHour = parseInt(currentTimeParts[0]);
      const currentMinute = parseInt(currentTimeParts[1]);
      
      // Check if reminder time has passed
      const reminderTimeInMinutes = reminderHour * 60 + reminderMinute;
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
    
      
      // Check if already notified today
      const lastNotifiedToday = reminder.lastNotified && 
        reminder.lastNotified.toDateString() === today.toDateString();
      
     
      
      return reminderTimeInMinutes <= currentTimeInMinutes && !lastNotifiedToday;
    });



    // Mark reminders as notified
    if (notificationsToShow.length > 0) {
      await Reminder.updateMany(
        { _id: { $in: notificationsToShow.map(r => r._id) } },
        { lastNotified: today }
      );
    }

    res.render('patient/dashboard', { 
      therapist, 
      activePlan, 
      recentLogs,
      dueReminders: notificationsToShow 
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
};
exports.getExercises = async (req, res) => {
  try {
    const activePlan = await ExercisePlan.findOne({
      patientId: req.user.id,
      status: 'active'
    }).populate('exercises.exerciseId');

    res.render('patient/exercises', { activePlan });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading exercises');
    res.redirect('/patient/dashboard');
  }
};

exports.getExerciseDetail = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      req.flash('error', 'Exercise not found');
      return res.redirect('/patient/exercises');
    }

    res.render('patient/exercise-detail', { exercise });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading exercise');
    res.redirect('/patient/exercises');
  }
};

exports.logExercise = async (req, res) => {
  try {
    const { painLevel, difficultyRating, notes, duration } = req.body;

    await ExerciseLog.create({
      patientId: req.user.id,
      exerciseId: req.params.id,
      painLevel: painLevel || null,
      difficultyRating: difficultyRating || null,
      notes: notes || '',
      metrics: {
        duration: duration || 0
      }
    });

    req.flash('success', 'Exercise logged successfully!');
    res.redirect('/patient/exercises');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error logging exercise');
    res.redirect('/patient/exercises');
  }
};

exports.getProgress = async (req, res) => {
  try {
    const logs = await ExerciseLog.find({ patientId: req.user.id })
      .sort({ completedAt: -1 })
      .populate('exerciseId');

    res.render('patient/progress', { logs });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading progress');
    res.redirect('/patient/dashboard');
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ 
      patientId: req.user.id 
    }).sort({ time: 1 });

    res.render('patient/reminders', { reminders });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading reminders');
    res.redirect('/patient/dashboard');
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { time, days } = req.body;

    // Make sure days is an array
    const daysArray = Array.isArray(days) ? days : [days];

    await Reminder.create({
      patientId: req.user.id,
      time,
      days: daysArray,
      isActive: true
    });

    req.flash('success', 'Reminder created successfully');
    res.redirect('/patient/reminders');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error creating reminder');
    res.redirect('/patient/reminders');
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    
    req.flash('success', 'Reminder deleted');
    res.redirect('/patient/reminders');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error deleting reminder');
    res.redirect('/patient/reminders');
  }
};