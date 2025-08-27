const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, questions, timeLimit } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      questions,
      timeLimit,
      createdBy: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .select('-questions.options.isCorrect')
      .populate('createdBy', 'name');
    res.json(quizzes);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get quiz by ID (public, but without correct answers)
// @route   GET /api/quizzes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.options.isCorrect')
      .populate('createdBy', 'name');

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404);
      throw new Error('Quiz not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get quiz by ID with correct answers (for quiz attempts)
// @route   GET /api/quizzes/:id/attempt
// @access  Private
router.get('/:id/attempt', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name');

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404);
      throw new Error('Quiz not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // Check if user is the quiz creator or an admin
    if (
      quiz.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to update this quiz');
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedQuiz);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // Check if user is the quiz creator or an admin
    if (
      quiz.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to delete this quiz');
    }

    await quiz.deleteOne();

    res.json({ message: 'Quiz removed' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Publish/Unpublish quiz
// @route   PUT /api/quizzes/:id/publish
// @access  Private
router.put('/:id/publish', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // Check if user is the quiz creator or an admin
    if (
      quiz.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to update this quiz');
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.json(quiz);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

module.exports = router;