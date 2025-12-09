import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '@/services/authService';
import { getToken } from '@/services/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(email, password);

      // Check if this is a different user than before - if so, clear cached data
      const previousUserId = localStorage.getItem('lastUserId');
      const newUserId = result.user?.id || result.user?.email;
      if (previousUserId && newUserId && previousUserId !== newUserId) {
        // Different user logging in - clear previous user's cached data
        localStorage.removeItem('analysisRunId');
        localStorage.removeItem('viewTier');
        localStorage.removeItem('onboardingComplete');
      }
      // Store current user ID for future comparison
      if (newUserId) {
        localStorage.setItem('lastUserId', newUserId);
      }

      if (result.token) {
        setToken(result.token);
      }
      setUser(result.user);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const register = async (email, password, firstName, lastName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser(email, password, firstName, lastName);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    logoutUser();
    // Clear user-specific data from localStorage
    localStorage.removeItem('analysisRunId');
    localStorage.removeItem('viewTier');
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('lastUserId');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, register, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
