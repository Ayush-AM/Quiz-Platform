// Test script to verify quiz data structure
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');

dotenv.config();

const testQuizData = async () => {
  try {
    await connectDB();
    
    console.log('Connected to database');
    
    // Get all quizzes
    const quizzes = await Quiz.find({});
    console.log(`Found ${quizzes.length} quizzes`);
    
    if (quizzes.length > 0) {
      const firstQuiz = quizzes[0];
      console.log('\nFirst quiz structure:');
      console.log('Title:', firstQuiz.title);
      console.log('Questions count:', firstQuiz.questions.length);
      
      if (firstQuiz.questions.length > 0) {
        const firstQuestion = firstQuiz.questions[0];
        console.log('\nFirst question structure:');
        console.log('Question text:', firstQuestion.questionText);
        console.log('Options:', firstQuestion.options.map((opt, idx) => ({
          index: idx,
          text: opt.text,
          isCorrect: opt.isCorrect
        })));
        
        // Find correct answer
        const correctIndex = firstQuestion.options.findIndex(opt => opt.isCorrect === true);
        console.log('Correct answer index:', correctIndex);
        console.log('Correct answer text:', correctIndex !== -1 ? firstQuestion.options[correctIndex].text : 'Not found');
      }
    } else {
      console.log('No quizzes found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

testQuizData();
