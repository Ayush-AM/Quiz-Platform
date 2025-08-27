const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Quiz = require('./models/Quiz');

const testSubmitResult = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get a user and quiz
    const user = await User.findOne();
    const quiz = await Quiz.findOne();

    if (!user || !quiz) {
      console.log('Need at least one user and one quiz in database');
      return;
    }

    console.log('User:', user.name);
    console.log('Quiz:', quiz.title);
    console.log('Questions in quiz:', quiz.questions.length);

    // Create a test payload with correct structure
    const testPayload = {
      quizId: quiz._id,
      timeTaken: 120, // 2 minutes
      answers: quiz.questions.slice(0, 3).map(question => {
        // Find the correct answer
        const correctOption = question.options.find(opt => opt.isCorrect);
        
        return {
          questionId: question._id,
          selectedOptionIds: [correctOption._id]
        };
      })
    };

    console.log('\nTest Payload:');
    console.log('Quiz ID:', testPayload.quizId);
    console.log('Answers count:', testPayload.answers.length);
    console.log('Sample answer:', testPayload.answers[0]);

    // Simulate the API call
    const response = await fetch('http://localhost:5000/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token || 'fake-token'}`
      },
      body: JSON.stringify(testPayload)
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Success! Result:', result);
    } else {
      const error = await response.text();
      console.log('Error:', error);
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.disconnect();
  }
};

testSubmitResult();
