import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    completedQuizzes: 0,
    averageScore: 0,
    totalPoints: 0,
    ranking: 0
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
          throw new Error('Failed to fetch stats');
        }

        const userStats = await response.json();
        setStats(userStats);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to user stats or defaults
        setStats({
          completedQuizzes: 0,
          averageScore: 0,
          totalPoints: 0,
          ranking: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();

    // Refresh stats every 5 minutes
    const intervalId = setInterval(loadStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, navigate]);

  const quizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      category: "Programming",
      questions: 5,
      timeLimit: "30 mins",
      difficulty: "Intermediate",
      participants: 1234,
      description: "Test your knowledge of core JavaScript concepts including data types, functions, and objects."
    },
    {
      id: 2,
      title: "React Hooks Deep Dive",
      category: "Web Development",
      questions: 4,
      timeLimit: "25 mins",
      difficulty: "Advanced",
      participants: 892,
      description: "Master React Hooks with this comprehensive quiz covering useState, useEffect, and custom hooks."
    },
    {
      id: 3,
      title: "CSS Grid & Flexbox",
      category: "Web Design",
      questions: 6,
      timeLimit: "40 mins",
      difficulty: "Beginner",
      participants: 1567,
      description: "Learn modern CSS layout techniques with Grid and Flexbox."
    },
    {
      id: 4,
      title: "Python Programming",
      category: "Programming",
      questions: 5,
      timeLimit: "35 mins",
      difficulty: "Beginner",
      participants: 2103,
      description: "Get started with Python programming basics and core concepts."
    }
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quizzes', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }

        const data = await response.json();
        
        // Transform the quiz data to include additional info
        const transformedQuizzes = data.map(quiz => ({
          id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          questions: quiz.questions.length,
          timeLimit: `${quiz.timeLimit} mins`,
          difficulty: getDifficultyLevel(quiz),
          participants: quiz.participants || 0,
          description: quiz.description,
          createdBy: quiz.createdBy.name
        }));

        setQuizzes(transformedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizError('Failed to load quizzes');
      }
    };

    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  // Helper function to determine quiz difficulty based on questions and time limit
  const getDifficultyLevel = (quiz) => {
    const avgPointsPerQuestion = quiz.questions.reduce((acc, q) => acc + (q.points || 1), 0) / quiz.questions.length;
    const timePerQuestion = quiz.timeLimit / quiz.questions.length;

    if (avgPointsPerQuestion >= 2 && timePerQuestion < 1.5) return "Advanced";
    if (avgPointsPerQuestion >= 1.5 || timePerQuestion < 2) return "Intermediate";
    return "Beginner";
  };

  // If loading or no user, show loading state
  if (isLoading || !user) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
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
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#ebf8ff', color: '#4299e1' }}>📚</div>
            <span>Completed Quizzes</span>
          </div>
          <div className="stat-value">{stats.completedQuizzes}</div>
          <div className="stat-label">
            {stats.completedQuizzes === 0 ? 'Start your first quiz!' :
             stats.completedQuizzes === 1 ? 'Great start!' :
             stats.completedQuizzes < 5 ? 'Keep going!' :
             'Quiz master!'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#fef6e6', color: '#ed8936' }}>🎯</div>
            <span>Average Score</span>
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

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#e6fffa', color: '#38b2ac' }}>⭐</div>
            <span>Total Points</span>
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

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#fae6e6', color: '#e53e3e' }}>🏆</div>
            <span>Global Ranking</span>
          </div>
          <div className="stat-value">#{stats.ranking}</div>
          <div className="stat-label">
            {stats.ranking === 0 ? 'Not ranked yet' :
             stats.ranking <= 10 ? 'Top 10!' :
             stats.ranking <= 50 ? 'Top 50!' :
             stats.ranking <= 100 ? 'Top 100!' :
             'Keep climbing!'}
          </div>
        </div>
      </div>

      {/* Available Quizzes Section */}
      <h2 className="section-title">
        📝 Available Quizzes
        <span className="badge">{quizzes.length} quizzes</span>
      </h2>
      
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-image">
              {quiz.category === "Programming" ? "👨‍💻" : 
               quiz.category === "Web Development" ? "🌐" : "🎨"}
            </div>
            <div className="quiz-content">
              <h3 className="quiz-title">{quiz.title}</h3>
              <div className="quiz-info">
                <span>{quiz.questions} Questions</span>
                <span>{quiz.timeLimit}</span>
              </div>
              <div className="quiz-info">
                <span>Difficulty: {quiz.difficulty}</span>
                <span>{quiz.participants.toLocaleString()} participants</span>
              </div>
              <div className="quiz-footer">
                <span className="badge">{quiz.category}</span>
                <Link to={`/quiz/${quiz.id}`} className="quiz-button">
                  Start Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
