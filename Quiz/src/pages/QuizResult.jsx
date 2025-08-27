import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './QuizResult.css';

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [results, setResults] = useState(null);
  const [statsUpdated, setStatsUpdated] = useState(false);
  const [quizData] = useState({
    title: "JavaScript Fundamentals",
    questions: [
      {
        id: 1,
        question: "What is the output of console.log(typeof null)?",
        options: ["null", "undefined", "object", "number"],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: "Which method is used to add elements to the end of an array?",
        options: ["push()", "unshift()", "pop()", "shift()"],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "What is the result of 3 + '3' in JavaScript?",
        options: ["6", "33", "NaN", "Error"],
        correctAnswer: 1,
      }
    ],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (location.state?.results) {
      setResults(location.state.results);
    } else {
      navigate('/dashboard');
    }
  }, [location, user, navigate]);

  // Update user stats when results are available
  useEffect(() => {
    if (results && user && !statsUpdated) {
      const score = calculateScore();
      
      const submitResult = async () => {
        try {
          // Submit the quiz result to the backend
          const response = await fetch('http://localhost:5000/api/results', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              quizId: results.quizId,
              score: score.correct * 100,
              timeTaken: results.timeSpent,
              answers: Object.entries(results.answers).map(([index, answer]) => ({
                questionId: quizData.questions[index].id,
                selectedOptionIds: [answer], // Adjust based on your data structure
                isCorrect: answer === quizData.questions[index].correctAnswer
              }))
            })
          });

          if (!response.ok) {
            throw new Error('Failed to submit quiz result');
          }

          // Fetch updated stats
          const statsResponse = await fetch(`http://localhost:5000/api/results/stats/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });

          if (!statsResponse.ok) {
            throw new Error('Failed to fetch updated stats');
          }

          const newStats = await statsResponse.json();

          // Update user data with new stats
          const updatedUser = {
            ...user,
            stats: newStats
          };

          // Update user in context
          login(updatedUser);
          setStatsUpdated(true);
        } catch (error) {
          console.error('Error updating stats:', error);
        }
      };

      submitResult();
    }
  }, [results, user, statsUpdated, login, quizData.questions]);

  if (!results) {
    return <div>Loading results...</div>;
  }

  const calculateScore = () => {
    const correctAnswers = Object.keys(results.answers).filter(questionIndex => 
      results.answers[questionIndex] === quizData.questions[questionIndex].correctAnswer
    ).length;
    
    return {
      correct: correctAnswers,
      total: quizData.questions.length,
      percentage: Math.round((correctAnswers / quizData.questions.length) * 100)
    };
  };

  const getScoreClass = (percentage) => {
    if (percentage >= 90) return 'score-excellent';
    if (percentage >= 75) return 'score-good';
    if (percentage >= 60) return 'score-average';
    return 'score-poor';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const score = calculateScore();

  return (
    <div className="quiz-result-container">
      <div className="result-card">
        <div className="result-header">
          <h1 className="result-title">Quiz Results</h1>
          <p className="quiz-name">{quizData.title}</p>
        </div>

        <div className="score-display">
          <div className={`score-circle ${getScoreClass(score.percentage)}`}>
            <div className="score-percentage">{score.percentage}%</div>
            <div className="score-label">Your Score</div>
          </div>
        </div>

        <div className="result-stats">
          <div className="stat-item">
            <div className="stat-value">{score.correct}/{score.total}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{score.total - score.correct}</div>
            <div className="stat-label">Incorrect Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{formatTime(results.timeSpent)}</div>
            <div className="stat-label">Time Taken</div>
          </div>
        </div>

        <div className="question-review">
          <h2 className="review-title">Question Review</h2>
          {quizData.questions.map((question, index) => (
            <div key={question.id} className="review-item">
              <div className="review-question">
                <strong>Q{index + 1}:</strong> {question.question}
              </div>
              <div className="review-answer">
                <span className={`answer-icon ${
                  results.answers[index] === question.correctAnswer 
                    ? 'answer-correct' 
                    : 'answer-incorrect'
                }`}>
                  {results.answers[index] === question.correctAnswer ? '✓' : '✗'}
                </span>
                <span>
                  Your answer: {question.options[results.answers[index] || 0]}
                  {results.answers[index] !== question.correctAnswer && (
                    <span className="correct-answer">
                      {" "}(Correct: {question.options[question.correctAnswer]})
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <Link to="/dashboard" className="action-button dashboard-button">
            Back to Dashboard
          </Link>
          <Link to={`/quiz/${quizData.id}`} className="action-button retry-button">
            Try Again
          </Link>
          {score.percentage >= 60 && (
            <button className="action-button certificate-button">
              Get Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
