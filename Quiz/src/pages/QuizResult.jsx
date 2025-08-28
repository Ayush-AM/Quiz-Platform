import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { processApiError, logError } from '../utils/errorHandler';
import ErrorBoundary from '../components/ErrorBoundary';
import { getApiUrl } from '../config/api';
import './QuizResult.css';


export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [results, setResults] = useState(null);
  const [statsUpdated, setStatsUpdated] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (location.state?.results) {
      setResults(location.state.results);
      
      // Fetch the quiz data to get correct answers
      const fetchQuizData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(getApiUrl(`api/quizzes/${location.state.results.quizId}/attempt`), {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch quiz data');
          }
          
          const data = await response.json();
          
          // Transform backend data to match our frontend structure
          const transformedData = {
            id: data._id,
            title: data.title,
            description: data.description,
            questions: data.questions.map((q, index) => {
              const correctIndex = q.options.findIndex(opt => opt.isCorrect === true);
              console.log(`QuizResult - Question ${index + 1}: correctIndex = ${correctIndex}, options:`, q.options.map((opt, i) => ({ text: opt.text, isCorrect: opt.isCorrect, index: i })));
              
              return {
                id: q._id, // Use the actual MongoDB ObjectId
                question: q.questionText,
                options: q.options.map(opt => opt.text),
                correctAnswer: correctIndex,
                originalQuestion: q // Keep the original question data
              };
            })
          };
          
          setQuizData(transformedData);
        } catch (err) {
          console.error('Error fetching quiz:', err);
          setError(err.message || 'Failed to load quiz data');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchQuizData();
    } else {
      navigate('/dashboard');
    }
  }, [location, user, navigate]);

  // Update user stats when results are available
  useEffect(() => {
    if (results && quizData && user && !statsUpdated && !isSubmitting) {
      const score = calculateScore();
      
      // Debug logging
      console.log('Preparing to submit quiz results:', {
        quizId: results.quizId,
        timeSpent: results.timeSpent,
        answers: results.answers,
        quizData: quizData
      });
      
      const submitResult = async () => {
        if (isSubmitting) {
          console.log('Quiz submission already in progress, skipping duplicate');
          return;
        }
        
        setIsSubmitting(true);
        console.log('Starting quiz result submission...');
        
        try {
          // Prepare the request payload
          console.log('Debug - Raw answers from QuizAttempt:', results.answers);
          console.log('Debug - Quiz data questions:', quizData.questions.length);
          
          const processedAnswers = [];
          
          // Process each answer
          Object.entries(results.answers).forEach(([questionIndex, answerOptionIndex]) => {
            const numIndex = parseInt(questionIndex, 10);
            const question = quizData.questions[numIndex];
            
            console.log(`Processing question ${numIndex + 1}:`);
            console.log('  User selected option index:', answerOptionIndex);
            console.log('  Question exists:', !!question);
            
            if (question && question.originalQuestion && question.originalQuestion.options) {
              const selectedOption = question.originalQuestion.options[answerOptionIndex];
              
              console.log('  Selected option:', selectedOption?.text);
              console.log('  Option ID:', selectedOption?._id);
              
              if (selectedOption && selectedOption._id) {
                processedAnswers.push({
                  questionId: question.id,
                  selectedOptionIds: [selectedOption._id]
                });
                console.log('  ✅ Answer processed successfully');
              } else {
                console.error('  ❌ Selected option not found');
              }
            } else {
              console.error('  ❌ Question data missing at index', numIndex);
            }
          });
          
          const payload = {
            quizId: results.quizId,
            timeTaken: results.timeSpent,
            answers: processedAnswers
          };
          
          console.log('Final processed answers count:', processedAnswers.length);
          
          // Log the final payload for debugging
          console.log('Submitting quiz result payload:', JSON.stringify(payload, null, 2));
          
          // Submit the quiz result to the backend
          const response = await fetch(getApiUrl('api/results'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(payload)
          });

          // Log the response status
          console.log('API response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(e => ({ message: 'Could not parse error response' }));
            console.error('API error response:', errorData);
            const errorMessage = errorData.message || await processApiError(response);
            throw new Error(errorMessage);
          }

          // The enhanced backend now returns stats directly
          const responseData = await response.json();
          
          // Extract stats and correct answers from the response
          const { stats: newStats, correctAnswers } = responseData;
          
          // Store correct answers for review if needed
          if (correctAnswers) {
            setResults(prev => ({
              ...prev,
              correctAnswers
            }));
          }

          // Update user data with new stats
          const updatedUser = {
            ...user,
            stats: newStats
          };

          // Update user in context
          login(updatedUser);
          setStatsUpdated(true);
        } catch (error) {
          logError(error, 'QuizResult component - submitResult', { quizId: results.quizId });
          setError(error.message || 'Failed to update your quiz results. Please try again.');
          console.error('Error submitting quiz result:', error);
        } finally {
          setIsSubmitting(false);
        }
      };

      submitResult();
    }
  }, [results, quizData, user, statsUpdated, isSubmitting, login]);

  if (isLoading) {
    return (
      <div className="quiz-result-container">
        <div className="loading-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-icon">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <div>Loading results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-result-container">
        <div className="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '1rem'}}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>Failed to update your quiz results</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => {
              setError('');
              setStatsUpdated(false);
              // Retry submission
              const score = calculateScore();
              const submitResult = async () => {
                try {
                  // Prepare the request payload
                  const payload = {
                    quizId: results.quizId,
                    timeTaken: results.timeSpent,
                    answers: Object.entries(results.answers).map(([index, answer]) => {
                      const question = quizData.questions[index];
                      const numIndex = parseInt(index, 10);
                      
                      if (!question || !question.originalQuestion || !question.originalQuestion.options) {
                        throw new Error(`Invalid question data at index ${numIndex}`);
                      }
                      
                      let selectedIds;
                      
                      try {
                        selectedIds = Array.isArray(answer) 
                          ? answer.map(optIdx => question.originalQuestion.options[optIdx]._id)
                          : [question.originalQuestion.options[answer]._id];
                      } catch (err) {
                        throw new Error(`Error processing answer for question ${numIndex}: ${err.message}`);
                      }
                      
                      return {
                        questionId: question.id,
                        selectedOptionIds: selectedIds
                      };
                    })
                  };
                  
                  // Submit the quiz result to the backend
                  const response = await fetch(getApiUrl('api/results'), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(payload)
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json().catch(e => ({ message: 'Could not parse error response' }));
                    throw new Error(errorData.message || 'Failed to update your quiz results');
                  }
                  
                  const responseData = await response.json();
                  
                  // Extract stats and correct answers from the response
                  const { stats: newStats, correctAnswers } = responseData;
                  
                  // Store correct answers for review if needed
                  if (correctAnswers) {
                    setResults(prev => ({
                      ...prev,
                      correctAnswers
                    }));
                  }
                  
                  // Update user data with new stats
                  const updatedUser = {
                    ...user,
                    stats: newStats
                  };
                  
                  // Update user in context
                  login(updatedUser);
                  setStatsUpdated(true);
                } catch (err) {
                  logError(err, 'QuizResult component - retry submitResult', { quizId: results.quizId });
                  setError(err.message || 'Failed to update your quiz results. Please try again.');
                }
              };
              
              submitResult();
            }} className="action-button retry-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Try Again
            </button>
            <button onClick={() => navigate('/dashboard')} className="action-button dashboard-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!results || !quizData) {
    return (
      <div className="quiz-result-container">
        <div className="loading-state">Loading results...</div>
      </div>
    );
  }

  const calculateScore = () => {
    // Count correct answers based on the question data
    let correctAnswers = 0;
    
    console.log('QuizResult - Calculating score with:', {
      answers: results.answers,
      questionsCount: quizData.questions.length
    });
    
    Object.entries(results.answers).forEach(([questionIndex, answer]) => {
      const question = quizData.questions[questionIndex];
      if (!question) {
        console.log(`Question at index ${questionIndex} not found`);
        return;
      }
      
      console.log(`QuizResult - Question ${parseInt(questionIndex) + 1}:`, {
        userAnswer: answer,
        correctAnswer: question.correctAnswer,
        question: question.question
      });
      
      // Check if we have the correct answer directly
      if (question.correctAnswer !== undefined) {
        const isCorrect = answer === question.correctAnswer;
        console.log(`Answer comparison: ${answer} === ${question.correctAnswer} = ${isCorrect}`);
        if (isCorrect) {
          correctAnswers++;
        }
        return;
      }
      
      // Fallback: try to find correct answer from options if they exist
      if (question.options && Array.isArray(question.options)) {
        const correctIndex = question.options.findIndex(opt => opt.isCorrect === true);
        console.log(`Fallback method - correctIndex: ${correctIndex}, userAnswer: ${answer}`);
        if (correctIndex !== -1 && answer === correctIndex) {
          correctAnswers++;
        }
      }
    });
    
    console.log(`QuizResult - Final score: ${correctAnswers}/${quizData.questions.length}`);
    
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

  const isAnswerCorrect = (question, userAnswer) => {
    if (!question) return false;
    
    // Check if we have the correct answer directly
    if (question.correctAnswer !== undefined) {
      return userAnswer === question.correctAnswer;
    }
    
    // Fallback: try to find correct answer from options if they exist
    if (question.options && Array.isArray(question.options)) {
      const correctIndex = question.options.findIndex(opt => opt.isCorrect === true);
      if (correctIndex !== -1) {
        return userAnswer === correctIndex;
      }
    }
    
    return false;
  };

  return (
    <ErrorBoundary>
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
              <div className="stat-value">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {score.correct}/{score.total}
              </div>
              <div className="stat-label">Correct Answers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-icon">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                {score.total - score.correct}
              </div>
              <div className="stat-label">Incorrect Answers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {formatTime(results.timeSpent)}
              </div>
              <div className="stat-label">Time Taken</div>
            </div>
          </div>

          <div className="question-review">
            <h2 className="review-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="review-icon" style={{marginRight: '8px'}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Question Review
            </h2>
            {quizData.questions.map((question, index) => {
              const userAnswer = results.answers[index];
              const correct = isAnswerCorrect(question, userAnswer);
              const userAnswerText = userAnswer === undefined
                ? 'Not answered'
                : Array.isArray(userAnswer)
                  ? userAnswer.map(i => question.options[i]).join(', ')
                  : question.options[userAnswer];
              const correctAnswerText = (() => {
                // If we have the correct answer index directly
                if (question.correctAnswer !== undefined) {
                  return question.options[question.correctAnswer];
                }
                
                // Fallback: try to find correct answer from options if they exist
                if (question.options && Array.isArray(question.options)) {
                  const correctIndex = question.options.findIndex(opt => opt.isCorrect === true);
                  if (correctIndex !== -1) {
                    return question.options[correctIndex];
                  }
                }
                
                return 'Unknown';
              })();
              return (
                <div key={question.id} className="review-item">
                  <div className="review-question">
                    <strong>Q{index + 1}:</strong> {question.question}
                  </div>
                  <div className="review-answer">
                    <span className={`answer-icon ${correct ? 'answer-correct' : 'answer-incorrect'}`}>
                      {correct ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </span>
                    <span>
                      Your answer: {userAnswerText}
                      {!correct && (
                        <span className="correct-answer"> {" "}(Correct: {correctAnswerText})</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="action-buttons">
            <Link to="/dashboard" className="action-button dashboard-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Back to Dashboard
            </Link>
            <Link to={`/quiz/${results.quizId}`} className="action-button retry-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              Try Again
            </Link>
            {score.percentage >= 60 && (
              <button className="action-button certificate-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M8 14h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 18h.01"></path>
                  <path d="M12 18h.01"></path>
                  <path d="M16 18h.01"></path>
                </svg>
                Get Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}