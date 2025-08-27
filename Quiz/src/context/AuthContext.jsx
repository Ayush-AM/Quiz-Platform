import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    try {
      // Ensure stats are properly initialized
      const userWithStats = {
        ...userData,
        stats: {
          completedQuizzes: userData.stats?.completedQuizzes || 0,
          averageScore: userData.stats?.averageScore || 0,
          totalPoints: userData.stats?.totalPoints || 0,
          ranking: userData.stats?.ranking || 0
        }
      };
      setUser(userWithStats);
      localStorage.setItem('user', JSON.stringify(userWithStats));
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user stats
  const updateStats = (newStats) => {
    if (user) {
      try {
        const updatedUser = {
          ...user,
          stats: newStats
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    }
  };

  const value = {
    user,
    login,
    logout,
    updateStats,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
