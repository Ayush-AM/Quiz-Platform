// Script to update all quizzes with improved MCQ and True/False questions only
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const { sampleQuizzes } = require('./data/quizData');
const reactHooksQuiz = require('./data/reactHooksQuiz');
const advancedJSQuiz = require('./data/advancedJSQuiz');
const scienceTechQuiz = require('./data/scienceTechQuiz');

dotenv.config();

const updateAllQuizzes = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    const quizzesToUpdate = [
      {
        title: "JavaScript Fundamentals",
        data: sampleQuizzes[0]
      },
      {
        title: "React Hooks Deep Dive",
        data: reactHooksQuiz
      },
      {
        title: "Advanced JavaScript & Web Development",
        data: advancedJSQuiz
      },
      {
        title: "Science & Technology Mastery",
        data: scienceTechQuiz
      }
    ];

    console.log('=== UPDATING ALL QUIZZES ===\n');

    for (const quizInfo of quizzesToUpdate) {
      console.log(`Updating: ${quizInfo.title}`);
      
      // Find the existing quiz
      const existingQuiz = await Quiz.findOne({ title: quizInfo.title });
      
      if (!existingQuiz) {
        console.log(`❌ ${quizInfo.title} not found, skipping...\n`);
        continue;
      }

      console.log(`Found existing quiz with ${existingQuiz.questions.length} questions`);
      
      // Update the quiz with new data
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        existingQuiz._id,
        {
          description: quizInfo.data.description,
          timeLimit: quizInfo.data.timeLimit,
          questions: quizInfo.data.questions
        },
        { new: true, runValidators: true }
      );

      // Show question type breakdown
      const questionTypes = {};
      let totalPoints = 0;
      
      updatedQuiz.questions.forEach(q => {
        const type = q.questionType || 'multiple-choice';
        questionTypes[type] = (questionTypes[type] || 0) + 1;
        totalPoints += q.points || 1;
      });
      
      console.log(`✅ Updated successfully!`);
      console.log(`   Time Limit: ${updatedQuiz.timeLimit} minutes`);
      console.log(`   Total Questions: ${updatedQuiz.questions.length}`);
      console.log(`   Question Types:`, Object.entries(questionTypes).map(([type, count]) => `${type}: ${count}`).join(', '));
      console.log(`   Total Points: ${totalPoints}\n`);
    }
    
    console.log('=== VERIFICATION ===');
    
    // Verify all quizzes
    const allQuizzes = await Quiz.find({}).select('title questions timeLimit');
    console.log(`\nDatabase now contains ${allQuizzes.length} total quizzes:`);
    
    allQuizzes.forEach(quiz => {
      const questionTypes = {};
      let totalPoints = 0;
      
      quiz.questions.forEach(q => {
        const type = q.questionType || 'multiple-choice';
        questionTypes[type] = (questionTypes[type] || 0) + 1;
        totalPoints += q.points || 1;
      });
      
      console.log(`\n📊 ${quiz.title}:`);
      console.log(`   Duration: ${quiz.timeLimit} minutes`);
      console.log(`   Questions: ${quiz.questions.length}`);
      console.log(`   Types: ${Object.entries(questionTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}`);
      console.log(`   Points: ${totalPoints}`);
    });
    
    console.log('\n✨ All quizzes have been successfully updated with MCQ and True/False questions only!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating quizzes:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  updateAllQuizzes();
}

module.exports = updateAllQuizzes;
