const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation helper for different question types
const validateQuestion = (question) => {
  const { questionType, options, correctAnswer, pairs, maxWords, rubric } = question;
  
  switch (questionType) {
    case 'multiple-choice':
      if (!options || options.length < 2) {
        throw new Error('Multiple choice questions must have at least 2 options');
      }
      if (!options.some(option => option.isCorrect)) {
        throw new Error('Multiple choice questions must have at least one correct answer');
      }
      break;
    
    case 'true-false':
      if (!options || options.length !== 2) {
        throw new Error('True/False questions must have exactly 2 options');
      }
      if (!options.some(option => option.isCorrect)) {
        throw new Error('True/False questions must have one correct answer');
      }
      break;
    
    case 'fill-in-blank':
      if (!correctAnswer || correctAnswer.trim() === '') {
        throw new Error('Fill-in-blank questions must have a correct answer');
      }
      break;
    
    case 'matching':
      if (!pairs || pairs.length < 2) {
        throw new Error('Matching questions must have at least 2 pairs');
      }
      for (const pair of pairs) {
        if (!pair.left || !pair.right || pair.left.trim() === '' || pair.right.trim() === '') {
          throw new Error('All matching pairs must have both left and right values');
        }
      }
      break;
    
    case 'essay':
      if (!maxWords || maxWords < 1) {
        throw new Error('Essay questions must have a maximum word limit');
      }
      if (!rubric || rubric.trim() === '') {
        throw new Error('Essay questions must have a grading rubric');
      }
      break;
    
    default:
      throw new Error(`Invalid question type: ${questionType}`);
  }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, questions, timeLimit } = req.body;

    // Validate each question based on its type
    if (questions && questions.length > 0) {
      questions.forEach((question, index) => {
        try {
          validateQuestion(question);
        } catch (error) {
          throw new Error(`Question ${index + 1}: ${error.message}`);
        }
      });
    }

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

// Helper function to grade different question types
const gradeQuestion = (question, userAnswer) => {
  const { questionType, options, correctAnswer, pairs } = question;
  
  switch (questionType) {
    case 'multiple-choice':
    case 'true-false':
      if (typeof userAnswer !== 'number' || userAnswer < 0 || userAnswer >= options.length) {
        return { isCorrect: false, points: 0 };
      }
      return {
        isCorrect: options[userAnswer].isCorrect,
        points: options[userAnswer].isCorrect ? question.points : 0
      };
    
    case 'fill-in-blank':
      if (typeof userAnswer !== 'string') {
        return { isCorrect: false, points: 0 };
      }
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      return {
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    
    case 'matching':
      if (!Array.isArray(userAnswer) || userAnswer.length !== pairs.length) {
        return { isCorrect: false, points: 0 };
      }
      let correctMatches = 0;
      for (let i = 0; i < pairs.length; i++) {
        if (userAnswer[i] === i) { // Assuming correct answer is the original order
          correctMatches++;
        }
      }
      const allCorrect = correctMatches === pairs.length;
      return {
        isCorrect: allCorrect,
        points: allCorrect ? question.points : (correctMatches / pairs.length) * question.points
      };
    
    case 'essay':
      // Essays require manual grading
      return {
        isCorrect: null, // Cannot be auto-graded
        points: 0, // Will be graded manually
        requiresManualGrading: true
      };
    
    default:
      return { isCorrect: false, points: 0 };
  }
};

// @desc    Submit quiz answers for grading
// @route   POST /api/quizzes/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of user answers
    
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    if (!quiz.isPublished) {
      res.status(400);
      throw new Error('Quiz is not published');
    }

    if (!answers || answers.length !== quiz.questions.length) {
      res.status(400);
      throw new Error('Invalid number of answers provided');
    }

    let totalScore = 0;
    let maxPossibleScore = 0;
    const gradedAnswers = [];
    let requiresManualGrading = false;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const result = gradeQuestion(question, userAnswer);
      
      maxPossibleScore += question.points;
      totalScore += result.points;
      
      if (result.requiresManualGrading) {
        requiresManualGrading = true;
      }
      
      gradedAnswers.push({
        questionIndex: index,
        userAnswer,
        isCorrect: result.isCorrect,
        pointsAwarded: result.points,
        maxPoints: question.points,
        requiresManualGrading: result.requiresManualGrading || false
      });
    });

    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

    const submissionResult = {
      quizId: quiz._id,
      quizTitle: quiz.title,
      totalScore,
      maxPossibleScore,
      percentage,
      gradedAnswers,
      requiresManualGrading,
      submittedAt: new Date(),
      submittedBy: req.user._id
    };

    res.status(200).json(submissionResult);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

module.exports = router;