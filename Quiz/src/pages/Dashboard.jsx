import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { processApiError, logError } from '../utils/errorHandler';
import ErrorBoundary from '../components/ErrorBoundary';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [quizError, setQuizError] = useState('');
  const [stats, setStats] = useState({
    completedQuizzes: 0,
    averageScore: 0,
    totalPoints: 0,
    ranking: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Check if user exists
    if (!user) {
      navigate('/login');
      return;
    }

    const loadStats = async () => {
      try {
        setIsLoading(true);
        // Fetch stats from backend
        const response = await fetch(`http://localhost:5000/api/results/stats/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorMessage = await processApiError(response);
          throw new Error(errorMessage);
        }

        const userStats = await response.json();
        if (!userStats) {
          throw new Error('No data received from server');
        }
        setStats(userStats);
      } catch (error) {
        logError(error, 'Dashboard component - loadStats', { userId: user.id });
        // Fallback to user stats or defaults
        if (user.stats) {
          setStats(user.stats);
        } else {
          setStats({
            completedQuizzes: 0,
            averageScore: 0,
            totalPoints: 0,
            ranking: 0,
            totalUsers: 0
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();

    // Refresh stats every 5 minutes
    const intervalId = setInterval(loadStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, navigate]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/quizzes', {
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
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid quiz data received from server');
        }
        
        // Transform the quiz data to include additional info
        const transformedQuizzes = data.map(quiz => ({
          id: quiz._id,
          title: quiz.title,
          category: quiz.category || 'General',
          questions: quiz.questions.length,
          timeLimit: `${quiz.timeLimit} mins`,
          difficulty: getDifficultyLevel(quiz),
          participants: quiz.participants || 0,
          description: quiz.description,
          createdBy: quiz.createdBy?.name || 'Admin'
        }));

        setQuizzes(transformedQuizzes);
      } catch (error) {
        logError(error, 'Dashboard component - fetchQuizzes', { userId: user.id });
        setQuizError('Failed to load quizzes');
        // Fallback to empty array if fetch fails
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  // Helper function to determine quiz difficulty based on questions and time limit
  const getDifficultyLevel = (quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) return "Beginner";
    
    const avgPointsPerQuestion = quiz.questions.reduce((acc, q) => acc + (q.points || 1), 0) / quiz.questions.length;
    const timePerQuestion = quiz.timeLimit / quiz.questions.length;

    if (avgPointsPerQuestion >= 2 && timePerQuestion < 1.5) return "Advanced";
    if (avgPointsPerQuestion >= 1.5 || timePerQuestion < 2) return "Intermediate";
    return "Beginner";
  };

  // If loading or no user, show loading state
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="profile-avatar">
              {user.name[0].toUpperCase()}
            </div>
            <div className="welcome-text">
              <h1>Welcome back, {user.name}!</h1>
              <p>Ready to challenge yourself today?</p>
            </div>
          </div>
          <button onClick={() => {
            logout();
            navigate('/login');
          }} className="logout-button">
            Logout
          </button>
        </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card" style={{'--card-index': 0}}>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#ebf8ff', color: '#4299e1' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <span style={{color: '#000'}}>Completed Quizzes</span>
          </div>
          <div className="stat-value">{stats.completedQuizzes}</div>
          <div className="stat-label">
            {stats.completedQuizzes === 0 ? 'Start your first quiz!' :
             stats.completedQuizzes === 1 ? 'Great start!' :
             stats.completedQuizzes < 5 ? 'Keep going!' :
             'Quiz master!'}
          </div>
        </div>

        <div className="stat-card" style={{'--card-index': 1}}>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#fef6e6', color: '#ed8936' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2v10l4.24 4.24"></path>
              </svg>
            </div>
            <span style={{color: '#000'}}>Average Score</span>
          </div>
          <div className="stat-value">{stats.averageScore}%</div>
          <div className="stat-label">
            {stats.averageScore === 0 ? 'Take your first quiz!' :
             stats.averageScore < 60 ? 'Keep practicing!' :
             stats.averageScore < 80 ? 'Good performance!' :
             stats.averageScore < 90 ? 'Great performance!' :
             'Outstanding!'}
          </div>
        </div>

        <div className="stat-card" style={{'--card-index': 2}}>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#e6fffa', color: '#38b2ac' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <span style={{color: '#000'}}>Total Points</span>
          </div>
          <div className="stat-value">{stats.totalPoints.toLocaleString()}</div>
          <div className="stat-label">
            {stats.totalPoints === 0 ? 'Start earning points!' :
             stats.totalPoints < 500 ? 'Points earned' :
             stats.totalPoints < 1000 ? 'Rising star!' :
             stats.totalPoints < 2000 ? 'Point master!' :
             'Point legend!'}
          </div>
        </div>

        <div className="stat-card" style={{'--card-index': 3}}>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#fae6e6', color: '#e53e3e' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path>
                <path d="M15 7a3 3 0 1 0-6 0c0 1.66 1.34 3 3 3s3-1.34 3-3z"></path>
              </svg>
            </div>
            <span style={{color: '#000'}}>Global Ranking</span>
          </div>
          <div className="stat-value">#{stats.ranking} <span className="total-users">of {stats.totalUsers}</span></div>
          <div className="stat-label">
            {stats.ranking === 0 ? 'Not ranked yet' :
             stats.ranking <= 10 ? 'Top 10!' :
             stats.ranking <= Math.ceil(stats.totalUsers * 0.1) ? `Top ${Math.ceil(stats.totalUsers * 0.1)}!` :
             stats.ranking <= Math.ceil(stats.totalUsers * 0.25) ? `Top ${Math.ceil(stats.totalUsers * 0.25)}!` :
             'Keep climbing!'}
          </div>
        </div>
      </div>

      {/* Available Quizzes Section */}
      <h2 className="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Available Quizzes
        <span className="badge">{quizzes.length} quizzes</span>
      </h2>
      
      {quizError && (
        <div className="error-message">{quizError}</div>
      )}
      
      {quizzes.length === 0 && !quizError ? (
        <div className="no-quizzes-message">
          <p>No quizzes available at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id} className="quiz-card" style={{'--card-index': index}}>
              <div className="quiz-image">
                {quiz.category === "Programming" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                ) : quiz.category === "Web Development" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                )}
              </div>
              <div className="quiz-content">
                <h3 className="quiz-title">{quiz.title}</h3>
                <div className="quiz-info">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {quiz.questions} Questions
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {quiz.timeLimit}
                  </span>
                </div>
                <div className="quiz-info">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Difficulty: {quiz.difficulty}
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {quiz.participants.toLocaleString()} participants
                  </span>
                </div>
                <div className="quiz-footer">
                  <span className="badge">{quiz.category}</span>
                  <Link to={`/quiz/${quiz.id}`} className="quiz-button">
                    Start Quiz
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
