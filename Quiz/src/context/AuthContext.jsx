import { createContext, useContext, useState, useEffect } from 'react';
import { logError } from '../utils/errorHandler';

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
      logError(error, 'AuthContext - loading user data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    try {
      if (!userData || !userData.id || !userData.token) {
        throw new Error('Invalid user data provided for login');
      }
      
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
      logError(error, 'AuthContext - login', { userId: userData?.id });
      throw error; // Re-throw to allow handling by the caller
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      logError(error, 'AuthContext - logout');
    }
  };

  // Update user stats
  const updateStats = (newStats) => {
    if (user) {
      try {
        if (!newStats) {
          throw new Error('Invalid stats data provided');
        }
        
        const updatedUser = {
          ...user,
          stats: newStats
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        logError(error, 'AuthContext - updateStats', { userId: user.id });
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
