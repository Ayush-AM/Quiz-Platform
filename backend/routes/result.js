const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit quiz result
// @route   POST /api/results
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    // Find the quiz with all details including correct answers
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    const processedAnswers = [];

    // Process each answer
    for (const answer of answers) {
      const question = quiz.questions.id(answer.questionId);
      
      if (!question) continue;
      
      totalPoints += question.points;
      
      // Check if the selected options match the correct options
      const correctOptionIds = question.options
        .filter(option => option.isCorrect)
        .map(option => option._id.toString());
      
      const selectedOptionIds = answer.selectedOptionIds.map(id => id.toString());
      
      // Check if arrays are equal (same length and all elements match)
      const isCorrect = 
        correctOptionIds.length === selectedOptionIds.length &&
        correctOptionIds.every(id => selectedOptionIds.includes(id));
      
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;
      
      processedAnswers.push({
        question: answer.questionId,
        selectedOptions: answer.selectedOptionIds,
        isCorrect,
        pointsEarned
      });
    }

    // Create result
    const result = await Result.create({
      user: req.user._id,
      quiz: quizId,
      score,
      totalPoints,
      answers: processedAnswers,
      timeTaken,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get user's results
// @route   GET /api/results
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title category')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz', 'title description category questions')
      .populate('user', 'name email');

    if (!result) {
      res.status(404);
      throw new Error('Result not found');
    }

    // Check if user is the result owner
    if (
      result.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to view this result');
    }

    res.json(result);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

module.exports = router;