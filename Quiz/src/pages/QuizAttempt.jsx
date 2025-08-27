import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { processApiError, logError } from '../utils/errorHandler';
import ErrorBoundary from '../components/ErrorBoundary';
import { quizData } from '../data/quizData';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizData, setQuizData] = useState(null);
  // Quiz starts immediately once data is loaded
  const [quizStarted] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch quiz data from backend
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/quizzes/${id}/attempt`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorMessage = await processApiError(response);
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        console.log('Raw quiz data from backend:', data);
        
        // Validate quiz data
        if (!data || !data.questions || !Array.isArray(data.questions)) {
          console.error('Invalid quiz data structure:', data);
          throw new Error('Invalid quiz data received from server');
        }
        
        // Transform backend data to match our frontend structure
        const transformedData = {
          id: data._id,
          title: data.title,
          description: data.description,
          totalQuestions: data.questions.length,
          timeLimit: data.timeLimit,
          questions: data.questions.map((q, index) => {
            // Find the correct answer index
            const correctIndex = q.options.findIndex(opt => opt.isCorrect === true);
            console.log(`Question ${index + 1}: correctIndex = ${correctIndex}, options:`, q.options.map((opt, i) => ({ text: opt.text, isCorrect: opt.isCorrect, index: i })));
            
            return {
              id: index + 1,
              question: q.questionText,
              options: q.options.map(opt => opt.text),
              correctAnswer: correctIndex
            };
          })
        };
        
        console.log('Transformed quiz data:', transformedData);
        
        setQuizData(transformedData);
        setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds
      } catch (err) {
        logError(err, 'QuizAttempt component - fetchQuizData', { quizId: id });
        console.error('Backend fetch failed, trying frontend fallback:', err);
        
        // Fallback to frontend data if backend fails
        try {
          const frontendQuiz = quizData[id];
          if (frontendQuiz) {
            console.log('Using frontend fallback data:', frontendQuiz);
            const transformedData = {
              id: id,
              title: frontendQuiz.title,
              description: frontendQuiz.description,
              totalQuestions: frontendQuiz.questions.length,
              timeLimit: frontendQuiz.timeLimit,
              questions: frontendQuiz.questions.map((q, index) => ({
                id: index + 1,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer
              }))
            };
            setQuizData(transformedData);
            setTimeLeft(frontendQuiz.timeLimit * 60);
            setError(''); // Clear any previous errors
          } else {
            setError('Quiz not found in backend or frontend data');
          }
        } catch (fallbackErr) {
          console.error('Frontend fallback also failed:', fallbackErr);
          setError(err.message || 'Failed to load quiz');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuizData();
  }, [id, user]);

  // Timer effect
  useEffect(() => {
    if (!quizData || timeLeft <= 0) return;

    const timer = setInterval(() => {
      try {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      } catch (err) {
        logError(err, 'QuizAttempt component - timer effect', { quizId: id });
        clearInterval(timer);
        setError('Error with quiz timer. Please refresh the page.');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizData, id]);

  const formatTime = (seconds) => {
    try {
      if (typeof seconds !== 'number' || isNaN(seconds)) {
        throw new Error('Invalid time value');
      }
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } catch (err) {
      logError(err, 'QuizAttempt component - formatTime', { seconds });
      return '0:00'; // Default fallback
    }
  };

  const getTimerClass = () => {
    try {
      if (timeLeft <= 300) return 'timer-danger'; // last 5 minutes
      if (timeLeft <= 600) return 'timer-warning'; // last 10 minutes
      return 'timer-running';
    } catch (err) {
      logError(err, 'QuizAttempt component - getTimerClass', { quizId: id });
      return 'timer-running'; // Default fallback
    }
  };

  const handleOptionSelect = (optionIndex) => {
    try {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const isCorrect = optionIndex === currentQuestion.correctAnswer;
      console.log(`Selected option ${optionIndex} for question ${currentQuestionIndex + 1}`);
      console.log(`Correct answer is: ${currentQuestion.correctAnswer}`);
      console.log(`Is correct: ${isCorrect}`);
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: optionIndex
      }));
    } catch (err) {
      logError(err, 'QuizAttempt component - handleOptionSelect', { quizId: id, questionIndex: currentQuestionIndex });
      setError('Failed to select option. Please try again.');
    }
  };

  const handleNextQuestion = () => {
    try {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (err) {
      logError(err, 'QuizAttempt component - handleNextQuestion', { quizId: id, questionIndex: currentQuestionIndex });
      setError('Failed to navigate to next question. Please try again.');
    }
  };

  const handlePreviousQuestion = () => {
    try {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      }
    } catch (err) {
      logError(err, 'QuizAttempt component - handlePreviousQuestion', { quizId: id, questionIndex: currentQuestionIndex });
      setError('Failed to navigate to previous question. Please try again.');
    }
  };

  const handleSubmitQuiz = () => {
    try {
      // Validate quiz data before submission
      if (!quizData || !quizData.questions) {
        throw new Error('Quiz data is invalid');
      }
      
      // Calculate results
      const results = {
        totalQuestions: quizData.questions.length,
        answeredQuestions: Object.keys(answers).length,
        timeSpent: quizData.timeLimit * 60 - timeLeft,
        answers: answers,
        quizId: id,
        quizTitle: quizData.title
      };

      // Navigate to results page with the data
      navigate('/quiz-result', { state: { results } });
    } catch (err) {
      logError(err, 'QuizAttempt component - handleSubmitQuiz', { quizId: id });
      setError('Failed to submit quiz. Please try again.');
    }
  };

  // Removed manual start; quiz starts automatically.

  if (isLoading) {
    return (
      <div className="quiz-attempt-container">
        <div className="loading-state">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-attempt-container">
        <div className="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="quiz-attempt-container">
        <div className="loading-state">Loading quiz data...</div>
      </div>
    );
  }

  if (!quizData.questions.length) {
    return (
      <div className="quiz-attempt-container">
        <div className="error-state">
          <p>No questions found for this quiz.</p>
          <button onClick={() => navigate('/dashboard')} className="nav-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Removed start screen so users see the quiz immediately
  
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  
  return (
    <ErrorBoundary>
      <div className="quiz-attempt-container">
        {/* Quiz Header */}
        <div className="quiz-header">
          <h1>{quizData.title}</h1>
          <div className="quiz-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="quiz-info">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </div>
        </div>

        {/* Timer */}
        <div className={`quiz-timer ${getTimerClass()}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Time Remaining:</span>
          <strong>{formatTime(timeLeft)}</strong>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-number">Question {currentQuestionIndex + 1}</div>
          <div className="question-text">{currentQuestion.question}</div>
          
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(index)}
              >
                <span className="option-indicator">
                  {answers[currentQuestionIndex] === index ? '✓' : String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-button previous"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Previous
            </button>
            {currentQuestionIndex === quizData.questions.length - 1 ? (
              <button
                className="nav-button submit-quiz"
                onClick={handleSubmitQuiz}
              >
                Submit Quiz
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </button>
            ) : (
              <button
                className="nav-button next"
                onClick={handleNextQuestion}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Question List */}
        <div className="question-list">
          <div className="question-list-title">Questions Overview</div>
          <div className="question-dots">
            {[...Array(quizData.questions.length)].map((_, index) => (
              <div
                key={index}
                className={`question-dot ${answers[index] !== undefined ? 'answered' : ''} ${
                  index === currentQuestionIndex ? 'current' : ''
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}