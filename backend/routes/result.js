const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit quiz result
// @route   POST /api/results
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('=== QUIZ RESULT SUBMISSION ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user._id);
    
    const { quizId, answers, timeTaken } = req.body;

    // Input validation
    if (!quizId) {
      console.log('❌ Quiz ID missing');
      res.status(400);
      throw new Error('Quiz ID is required');
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.log('❌ Invalid answers:', { answers, isArray: Array.isArray(answers), length: answers?.length });
      res.status(400);
      throw new Error('Valid answers are required');
    }

    if (timeTaken === undefined || timeTaken < 0) {
      console.log('❌ Invalid timeTaken:', timeTaken);
      res.status(400);
      throw new Error('Valid time taken is required');
    }
    
    console.log('✅ Initial validation passed');
    console.log('Quiz ID:', quizId);
    console.log('Answers count:', answers.length);
    console.log('Time taken:', timeTaken);

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
    const correctAnswers = [];

    // Process each answer
    console.log('\n--- Processing Answers ---');
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      console.log(`\nProcessing answer ${i + 1}:`, answer);
      
      // Validate answer structure
      if (!answer.questionId || !answer.selectedOptionIds || !Array.isArray(answer.selectedOptionIds)) {
        console.log('❌ Invalid answer format for answer', i + 1);
        res.status(400);
        throw new Error('Invalid answer format');
      }

      const question = quiz.questions.id(answer.questionId);
      console.log('Found question:', question ? 'YES' : 'NO');
      
      if (!question) {
        console.log('❌ Question not found:', answer.questionId);
        res.status(400);
        throw new Error(`Question with ID ${answer.questionId} not found in quiz`);
      }
      
      console.log('Question points:', question.points);
      totalPoints += question.points;
      
      // Check if the selected options match the correct options
      const correctOptionIds = question.options
        .filter(option => option.isCorrect)
        .map(option => option._id.toString());
      
      const selectedOptionIds = answer.selectedOptionIds.map(id => id.toString());
      
      console.log('Correct option IDs:', correctOptionIds);
      console.log('Selected option IDs:', selectedOptionIds);
      
      // Check if arrays are equal (same length and all elements match)
      const isCorrect = 
        correctOptionIds.length === selectedOptionIds.length &&
        correctOptionIds.every(id => selectedOptionIds.includes(id)) &&
        selectedOptionIds.every(id => correctOptionIds.includes(id));
      
      console.log('Is correct:', isCorrect);
      
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;
      console.log('Points earned:', pointsEarned);
      console.log('Current total score:', score);
      console.log('Current total points:', totalPoints);
      
      processedAnswers.push({
        question: answer.questionId,
        selectedOptions: answer.selectedOptionIds,
        isCorrect,
        pointsEarned
      });

      // Store correct answers for response
      correctAnswers.push({
        questionId: answer.questionId,
        questionText: question.questionText,
        correctOptionIds: correctOptionIds,
        userSelectedOptionIds: selectedOptionIds,
        isCorrect: isCorrect
      });
    }
    
    console.log('\n=== FINAL CALCULATION RESULTS ===');
    console.log('Final score:', score);
    console.log('Final total points:', totalPoints);
    console.log('Processed answers count:', processedAnswers.length);
    console.log('Score percentage:', totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0, '%');

    console.log('\n--- Saving to Database ---');
    console.log('Saving result with:', { score, totalPoints, answersCount: processedAnswers.length, timeTaken });
    console.log('Processed answers sample:', processedAnswers.slice(0, 2));
    
    // Validate data before save
    if (processedAnswers.length === 0) {
      console.log('❌ ERROR: No processed answers to save!');
      res.status(400);
      throw new Error('No answers were processed');
    }
    
    if (score === 0 && totalPoints === 0) {
      console.log('⚠️ WARNING: Saving result with 0 score and 0 total points');
    }
    
    // Create result
    const resultData = {
      user: req.user._id,
      quiz: quizId,
      score,
      totalPoints,
      answers: processedAnswers,
      timeTaken,
    };
    
    console.log('Final result data being saved:', JSON.stringify(resultData, null, 2));
    
    const result = await Result.create(resultData);
    
    if (!result) {
      console.log('❌ ERROR: Result.create returned null or empty');
      res.status(500);
      throw new Error('Failed to create result record');
    }
    
    console.log('✅ Result saved successfully:', result._id);
    console.log('Saved result verification:', {
      savedScore: result.score,
      savedTotalPoints: result.totalPoints,
      savedAnswersCount: result.answers.length
    });
    
    // Double-check the save by querying it back
    const savedResult = await Result.findById(result._id);
    if (!savedResult) {
      console.log('❌ ERROR: Result was not actually saved to database');
      res.status(500);
      throw new Error('Result save verification failed');
    } else {
      console.log('✅ Save verification successful - result exists in database');
    }

    // Calculate user statistics
    const userResults = await Result.find({ user: req.user._id });
      
      // Calculate statistics
      const completedQuizzes = userResults.length;
      
      // Calculate total points earned and average score
      let totalPointsEarned = 0;
      let totalScorePercentage = 0;
      
      userResults.forEach(userResult => {
        totalPointsEarned += userResult.score;
        // Calculate score percentage for this result
        const scorePercentage = userResult.totalPoints > 0 
          ? (userResult.score / userResult.totalPoints) * 100 
          : 0;
        totalScorePercentage += scorePercentage;
      });
      
      const averageScore = Math.round(totalScorePercentage / completedQuizzes) || 0;

    // Get user ranking
    const allUserStats = await Result.aggregate([
      { $group: {
          _id: '$user',
          totalPoints: { $sum: '$score' },
          quizCount: { $sum: 1 }
        }
      },
      { $sort: { totalPoints: -1, quizCount: -1 } }
    ]);

    // Find the user's position in the ranking
    let ranking = 0;
    for (let i = 0; i < allUserStats.length; i++) {
      if (allUserStats[i]._id.toString() === req.user._id.toString()) {
        ranking = i + 1; // +1 because array is 0-indexed
        break;
      }
    }
    
    // Update user stats in the database
    const User = require('../models/User');
    await User.findByIdAndUpdate(
      req.user._id,
      {
        stats: {
          completedQuizzes,
          averageScore,
          totalPoints: totalPointsEarned,
          ranking,
          lastUpdated: new Date()
        }
      }
    );

    console.log('✅ User stats updated successfully');
    console.log('Final stats:', {
      completedQuizzes,
      averageScore,
      totalPoints: totalPointsEarned,
      ranking
    });

    // Return structured response
    res.status(201).json({
      result: result,
      stats: {
        completedQuizzes,
        averageScore,
        totalPoints: totalPointsEarned,
        ranking
      },
      correctAnswers,
      message: 'Quiz submitted successfully'
    });
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

// @desc    Get user statistics
// @route   GET /api/results/stats/:userId
// @access  Private
router.get('/stats/:userId', protect, async (req, res) => {
  try {
    // Verify user is requesting their own stats or is an admin
    if (
      req.params.userId !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to view these statistics');
    }

    // Get all results for the user
    const results = await Result.find({ user: req.params.userId })
      .populate('quiz', 'title category');

    if (!results || results.length === 0) {
      // Return default stats if no results found
      return res.json({
        completedQuizzes: 0,
        averageScore: 0,
        totalPoints: 0,
        ranking: 0
      });
    }

    // Calculate statistics
    const completedQuizzes = results.length;
    
    // Calculate total points earned and average score
    let totalPointsEarned = 0;
    let totalScorePercentage = 0;
    
    results.forEach(result => {
      totalPointsEarned += result.score;
      // Calculate score percentage for this result
      const scorePercentage = result.totalPoints > 0 
        ? (result.score / result.totalPoints) * 100 
        : 0;
      totalScorePercentage += scorePercentage;
    });
    
    const averageScore = Math.round(totalScorePercentage / completedQuizzes) || 0;

    // Get user ranking (based on total points)
    // First, get all users' total points
    const allUserStats = await Result.aggregate([
      { $group: {
          _id: '$user',
          totalPoints: { $sum: '$score' },
          quizCount: { $sum: 1 }
        }
      },
      { $sort: { totalPoints: -1, quizCount: -1 } }
    ]);

    // Find the user's position in the ranking
    let ranking = 0;
    for (let i = 0; i < allUserStats.length; i++) {
      if (allUserStats[i]._id.toString() === req.params.userId) {
        ranking = i + 1; // +1 because array is 0-indexed
        break;
      }
    }

    // Return the statistics with total users count
    res.json({
      completedQuizzes,
      averageScore,
      totalPoints: totalPointsEarned,
      ranking,
      totalUsers: allUserStats.length
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

module.exports = router;