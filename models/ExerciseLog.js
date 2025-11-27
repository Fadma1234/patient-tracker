const mongoose = require('mongoose');

const ExerciseLogSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExercisePlan'
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  painLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  difficultyRating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  metrics: {
    flexibility: Number,
    strength: Number,
    duration: Number // actual time spent in seconds
  }
});

module.exports = mongoose.model('ExerciseLog', ExerciseLogSchema);