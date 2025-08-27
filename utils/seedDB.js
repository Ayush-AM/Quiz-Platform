/* Seed database with sample users and quizzes (10 questions each) */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

dotenv.config();

const createSampleQuestions = (topic) => {
  // Returns 10 questions with 4 options each; first option is correct for simplicity
  const base = [
    {
      questionText: `What does ${topic} primarily refer to?`,
      options: [
        { text: `${topic} core concept`, isCorrect: true },
        { text: 'A random idea', isCorrect: false },
        { text: 'An unrelated term', isCorrect: false },
        { text: 'None of the above', isCorrect: false },
      ],
    },
    {
      questionText: `Choose the correct statement about ${topic}.`,
      options: [
        { text: `${topic} correct statement`, isCorrect: true },
        { text: 'Incorrect statement 1', isCorrect: false },
        { text: 'Incorrect statement 2', isCorrect: false },
        { text: 'Incorrect statement 3', isCorrect: false },
      ],
    },
  ];

  // Expand to 10 with variants
  while (base.length < 10) {
    const idx = base.length + 1;
    base.push({
      questionText: `${topic} question ${idx}: pick the correct answer`,
      options: [
        { text: `Correct for ${topic} #${idx}`, isCorrect: true },
        { text: `Distractor A #${idx}`, isCorrect: false },
        { text: `Distractor B #${idx}`, isCorrect: false },
        { text: `Distractor C #${idx}`, isCorrect: false },
      ],
    });
  }

  // Add points
  return base.map((q) => ({ ...q, points: 1 }));
};

const seed = async () => {
  try {
    await connectDB();

    // Ensure an admin exists to satisfy createdBy requirement
    let admin = await User.findOne({ email: 'admin@example.com' }).select('+password');
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Created default admin: admin@example.com / Admin@123');
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});

    const quizzes = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Core concepts including types, scope, and basics.',
        category: 'Technology',
        questions: createSampleQuestions('JavaScript'),
        timeLimit: 25,
        isPublished: true,
        createdBy: admin._id,
      },
      {
        title: 'React Hooks Deep Dive',
        description: 'useState, useEffect, and custom hooks essentials.',
        category: 'Technology',
        questions: createSampleQuestions('React Hooks'),
        timeLimit: 25,
        isPublished: true,
        createdBy: admin._id,
      },
    ];

    await Quiz.insertMany(quizzes);
    console.log('Inserted quizzes with 10 questions each');

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

// Allow cleaning via `node utils/seedDB.js --clean`
if (process.argv.includes('--clean')) {
  (async () => {
    try {
      await connectDB();
      await Quiz.deleteMany({});
      console.log('Quizzes cleared.');
      process.exit(0);
    } catch (e) {
      console.error('Clean failed:', e);
      process.exit(1);
    }
  })();
} else {
  seed();
}


