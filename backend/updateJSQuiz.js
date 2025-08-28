// Script to update the JavaScript Fundamentals quiz with improved MCQ and True/False questions
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const { sampleQuizzes } = require('./data/quizData');

dotenv.config();

const updateJavaScriptQuiz = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find the existing JavaScript Fundamentals quiz
    const existingQuiz = await Quiz.findOne({ title: "JavaScript Fundamentals" });
    
    if (!existingQuiz) {
      console.log('JavaScript Fundamentals quiz not found');
      return;
    }

    console.log('Found existing JavaScript Fundamentals quiz');
    console.log(`Current questions: ${existingQuiz.questions.length}`);
    
    // Get the updated quiz data
    const updatedQuizData = sampleQuizzes[0]; // JavaScript Fundamentals is the first quiz
    
    // Update the quiz with new data
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      existingQuiz._id,
      {
        description: updatedQuizData.description,
        timeLimit: updatedQuizData.timeLimit,
        questions: updatedQuizData.questions
      },
      { new: true, runValidators: true }
    );

    console.log('\n=== QUIZ UPDATE SUCCESSFUL ===');
    console.log(`Title: ${updatedQuiz.title}`);
    console.log(`Description: ${updatedQuiz.description}`);
    console.log(`Time Limit: ${updatedQuiz.timeLimit} minutes`);
    console.log(`Total Questions: ${updatedQuiz.questions.length}`);
    
    // Show question type breakdown
    const questionTypes = {};
    let totalPoints = 0;
    
    updatedQuiz.questions.forEach(q => {
      const type = q.questionType || 'multiple-choice';
      questionTypes[type] = (questionTypes[type] || 0) + 1;
      totalPoints += q.points || 1;
    });
    
    console.log('\n=== QUESTION BREAKDOWN ===');
    Object.entries(questionTypes).forEach(([type, count]) => {
      console.log(`${type}: ${count} questions`);
    });
    
    console.log(`\nTotal Points: ${totalPoints}`);
    
    console.log('\n=== SAMPLE QUESTIONS ===');
    updatedQuiz.questions.slice(0, 3).forEach((q, index) => {
      console.log(`${index + 1}. ${q.questionText}`);
      console.log(`   Type: ${q.questionType}`);
      console.log(`   Points: ${q.points}`);
      if (q.options) {
        console.log(`   Options: ${q.options.length}`);
      }
      console.log('');
    });
    
    console.log('JavaScript Fundamentals quiz has been successfully updated!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating JavaScript quiz:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  updateJavaScriptQuiz();
}

module.exports = updateJavaScriptQuiz;
