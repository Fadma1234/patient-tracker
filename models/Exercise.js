const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: [String],
  videoUrl: String, // Cloudinary URL
  imageUrl: String, // Cloudinary URL
  category: {
    type: String,
    enum: ['mobility', 'strength', 'stretching', 'balance', 'cardio'],
    default: 'strength'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isTemplate: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);