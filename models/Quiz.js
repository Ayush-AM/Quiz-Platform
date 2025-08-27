const mongoose = require('mongoose');

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['General Knowledge', 'Science', 'History', 'Geography', 'Sports', 'Entertainment', 'Technology', 'Other'],
    },
    questions: [
      {
        questionText: {
          type: String,
          required: [true, 'Please add a question'],
        },
        options: [
          {
            text: {
              type: String,
              required: [true, 'Please add an option'],
            },
            isCorrect: {
              type: Boolean,
              required: true,
              default: false,
            },
          },
        ],
        points: {
          type: Number,
          default: 1,
        },
      },
    ],
    timeLimit: {
      type: Number, // in minutes
      default: 0, // 0 means no time limit
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);