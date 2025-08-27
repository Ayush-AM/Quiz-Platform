import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="nav-button">
            Back to Dashboard
          </button>
        </div>
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [quizData, setQuizData] = useState(() => {
    const quizzes = {
      '1': {
        title: "JavaScript Fundamentals",
        description: "Test your JavaScript knowledge",
        totalQuestions: 5,
        timeLimit: 30,
        questions: [
          {
            id: 1,
            question: "What is the output of console.log(typeof null)?",
            options: ["null", "undefined", "object", "number"],
            correctAnswer: 2
          },
          {
            id: 2,
            question: "Which method is used to add elements to the end of an array?",
            options: ["push()", "unshift()", "pop()", "shift()"],
            correctAnswer: 0
          },
          {
            id: 3,
            question: "What is the result of 3 + '3' in JavaScript?",
            options: ["6", "33", "NaN", "Error"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "Which operator is used for strict equality comparison?",
            options: ["==", "===", "=", "!="],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is the correct way to declare a variable in JavaScript?",
            options: ["variable x;", "var x;", "v x;", "x = var;"],
            correctAnswer: 1
          }
        ]
      },
      '2': {
        title: "React Fundamentals",
        description: "Master React basics",
        totalQuestions: 5,
        timeLimit: 25,
        questions: [
          {
            id: 1,
            question: "What hook is used for side effects in React?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Which method is used to render React elements?",
            options: ["ReactDOM.render()", "React.create()", "React.mount()", "DOM.render()"],
            correctAnswer: 0
          },
          {
            id: 3,
            question: "What is JSX?",
            options: [
              "JavaScript XML",
              "Java Syntax Extension",
              "JavaScript Extension",
              "JSON XML"
            ],
            correctAnswer: 0
          },
          {
            id: 4,
            question: "How do you handle events in React?",
            options: [
              "Using onclick attribute",
              "Using onClick={handleClick}",
              "Using addEventListener",
              "Using bind()"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is the virtual DOM?",
            options: [
              "A direct copy of the real DOM",
              "A lightweight copy of the real DOM",
              "A browser feature",
              "A JavaScript library"
            ],
            correctAnswer: 1
          }
        ]
      },
      '3': {
        title: "Python Basics",
        description: "Learn Python fundamentals",
        totalQuestions: 5,
        timeLimit: 20,
        questions: [
          {
            id: 1,
            question: "What is the correct way to declare a list in Python?",
            options: ["list = []", "list = {}", "list = ()", "list = <>"],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "Which symbol is used for comments in Python?",
            options: ["//", "/**/", "#", "--"],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "What is the output of print(len('Hello'))?",
            options: ["4", "5", "6", "Error"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "How do you create a function in Python?",
            options: [
              "function myFunc():",
              "def myFunc():",
              "create myFunc():",
              "func myFunc():"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "Which data type is immutable in Python?",
            options: ["List", "Dictionary", "String", "Set"],
            correctAnswer: 2
          }
        ]
      },
      '4': {
        title: "HTML & CSS",
        description: "Web development basics",
        totalQuestions: 5,
        timeLimit: 20,
        questions: [
          {
            id: 1,
            question: "Which HTML tag is used for creating a hyperlink?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Colorful Style Sheets",
              "Creative Style Sheets"
            ],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "Which property changes text color in CSS?",
            options: ["text-color", "color", "font-color", "text-style"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "What is the correct HTML for creating a checkbox?",
            options: [
              "<input type='check'>",
              "<input type='checkbox'>",
              "<checkbox>",
              "<check>"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "Which CSS property is used to change the font of text?",
            options: ["text-font", "font-family", "font-style", "text-family"],
            correctAnswer: 1
          }
        ]
      }
    };
    
    const selectedQuiz = quizzes[id];
    if (selectedQuiz) {
      setTimeLeft(selectedQuiz.timeLimit * 60); // Convert minutes to seconds
      setIsLoading(false);
      return selectedQuiz;
    } else {
      setError('Quiz not found');
      setIsLoading(false);
      return null;
    }
  });
  
  // Quiz data is now hardcoded in the component

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 300) return 'timer-danger'; // last 5 minutes
    if (timeLeft <= 600) return 'timer-warning'; // last 10 minutes
    return 'timer-running';
  };

  const handleOptionSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
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
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
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
        <span>⏰ Time Remaining:</span>
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
            Previous
          </button>
          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <button
              className="nav-button submit-quiz"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="nav-button next"
              onClick={handleNextQuestion}
            >
              Next
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
  );
}
