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
        questionType: {
          type: String,
          required: [true, 'Please specify question type'],
          enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'matching', 'essay'],
          default: 'multiple-choice',
        },
        // For multiple-choice and true-false questions
        options: [
          {
            text: {
              type: String,
              required: function() {
                return this.parent().questionType === 'multiple-choice' || this.parent().questionType === 'true-false';
              },
            },
            isCorrect: {
              type: Boolean,
              required: function() {
                return this.parent().questionType === 'multiple-choice' || this.parent().questionType === 'true-false';
              },
              default: false,
            },
          },
        ],
        // For fill-in-blank questions
        correctAnswer: {
          type: String,
          required: function() {
            return this.questionType === 'fill-in-blank';
          },
        },
        // For matching questions
        pairs: [
          {
            left: {
              type: String,
              required: function() {
                return this.parent().questionType === 'matching';
              },
            },
            right: {
              type: String,
              required: function() {
                return this.parent().questionType === 'matching';
              },
            },
          },
        ],
        // For essay questions (no automatic grading)
        maxWords: {
          type: Number,
          required: function() {
            return this.questionType === 'essay';
          },
          default: 200,
        },
        rubric: {
          type: String,
          required: function() {
            return this.questionType === 'essay';
          },
        },
        points: {
          type: Number,
          default: 1,
        },
        explanation: {
          type: String,
          default: '',
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