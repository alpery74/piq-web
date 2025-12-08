import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser } from '@/services/authService';
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
      if (result.token) {
        setToken(result.token);
      }
      setUser(result.user);
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Login failed', err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    logoutUser();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
