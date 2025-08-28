// Debug script to test the quiz API directly
// Using built-in fetch (Node 18+)

async function testQuizAPI() {
  try {
    console.log('Testing Quiz API...\n');
    
    const response = await fetch('http://localhost:5000/api/quizzes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quizzes = await response.json();
    
    console.log('\n=== QUIZ API RESULTS ===');
    console.log(`Total quizzes found: ${quizzes.length}`);
    console.log('');

    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title}`);
      console.log(`   ID: ${quiz._id}`);
      console.log(`   Category: ${quiz.category}`);
      console.log(`   Questions: ${quiz.questions ? quiz.questions.length : 0}`);
      console.log(`   Time limit: ${quiz.timeLimit} minutes`);
      console.log(`   Published: ${quiz.isPublished}`);
      console.log(`   Created by: ${quiz.createdBy ? quiz.createdBy.name || quiz.createdBy : 'Unknown'}`);
      console.log('');
    });

    console.log('=== QUESTION TYPE BREAKDOWN ===');
    quizzes.forEach((quiz) => {
      if (quiz.questions && quiz.questions.length > 0) {
        console.log(`\n${quiz.title}:`);
        const questionTypes = {};
        quiz.questions.forEach(q => {
          const type = q.questionType || 'multiple-choice';
          questionTypes[type] = (questionTypes[type] || 0) + 1;
        });
        Object.entries(questionTypes).forEach(([type, count]) => {
          console.log(`  ${type}: ${count}`);
        });
      }
    });

  } catch (error) {
    console.error('Error testing quiz API:', error.message);
    console.error('Full error:', error);
  }
}

testQuizAPI();
