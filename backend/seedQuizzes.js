// Script to seed the database with new comprehensive quizzes
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Quiz = require('./models/Quiz');
const User = require('./models/User');
const advancedJSQuiz = require('./data/advancedJSQuiz');
const scienceTechQuiz = require('./data/scienceTechQuiz');

dotenv.config();

const seedQuizzes = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find an admin user or create a default one for quiz creation
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = await User.create({
        name: 'Quiz Admin',
        email: 'admin@quizplatform.com',
        password: 'password123', // This should be hashed by the User model pre-save middleware
        role: 'admin'
      });
      console.log('Created default admin user');
    }

    // Check if quizzes already exist
    const existingJSQuiz = await Quiz.findOne({ title: advancedJSQuiz.title });
    const existingScienceQuiz = await Quiz.findOne({ title: scienceTechQuiz.title });

    const quizzesToCreate = [];

    if (!existingJSQuiz) {
      quizzesToCreate.push({
        ...advancedJSQuiz,
        createdBy: adminUser._id,
        isPublished: true
      });
      console.log('Will create Advanced JavaScript & Web Development quiz');
    } else {
      console.log('Advanced JavaScript quiz already exists');
    }

    if (!existingScienceQuiz) {
      quizzesToCreate.push({
        ...scienceTechQuiz,
        createdBy: adminUser._id,
        isPublished: true
      });
      console.log('Will create Science & Technology quiz');
    } else {
      console.log('Science & Technology quiz already exists');
    }

    if (quizzesToCreate.length > 0) {
      const createdQuizzes = await Quiz.insertMany(quizzesToCreate);
      console.log(`\nSuccessfully created ${createdQuizzes.length} new quizzes:`);
      
      createdQuizzes.forEach(quiz => {
        console.log(`- ${quiz.title} (${quiz.questions.length} questions, ${quiz.category} category)`);
        
        // Show question type breakdown
        const questionTypes = {};
        quiz.questions.forEach(q => {
          questionTypes[q.questionType] = (questionTypes[q.questionType] || 0) + 1;
        });
        
        console.log('  Question types:', Object.entries(questionTypes).map(([type, count]) => `${type}: ${count}`).join(', '));
        console.log(`  Total points: ${quiz.questions.reduce((sum, q) => sum + q.points, 0)}`);
        console.log(`  Time limit: ${quiz.timeLimit} minutes\n`);
      });
    } else {
      console.log('All quizzes already exist in the database');
    }

    // Display summary of all quizzes
    const allQuizzes = await Quiz.find({}).populate('createdBy', 'name');
    console.log(`\nDatabase now contains ${allQuizzes.length} total quizzes:`);
    allQuizzes.forEach(quiz => {
      console.log(`- ${quiz.title} (${quiz.category}, ${quiz.questions.length} questions)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedQuizzes();
}

module.exports = seedQuizzes;
