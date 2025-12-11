import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '@/services/authService';
import { getToken } from '@/services/client';
import { getSubscriptionStatus, getUserLimits } from '@/services/stripe';

const AuthContext = createContext(null);

// Helper to get stored user from localStorage
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState({ tier: 'free', status: 'active' });
  const [usage, setUsage] = useState({ analysesUsed: 0, analysesLimit: 5 });

  useEffect(() => {
    setToken(getToken());
    setUser(getStoredUser());
  }, []);

  // Fetch subscription and usage when token changes
  useEffect(() => {
    if (token) {
      fetchSubscription();
      fetchUsage();
    } else {
      setSubscription({ tier: 'free', status: 'active' });
      setUsage({ analysesUsed: 0, analysesLimit: 5 });
    }
  }, [token]);

  const fetchSubscription = async () => {
    if (!token) return;
    try {
      const data = await getSubscriptionStatus(token);
      setSubscription({
        tier: data.tier || 'free',
        status: data.status || 'active',
        expiresAt: data.expiresAt,
      });
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      // Keep default free tier on error
    }
  };

  const fetchUsage = async () => {
    if (!token) return;
    try {
      const data = await getUserLimits(token);
      setUsage({
        analysesUsed: data?.usage_stats?.analyses_used || 0,
        analysesLimit: data?.tier_limits?.max_analyses_per_month || 5,
      });
    } catch (err) {
      console.error('Failed to fetch usage:', err);
      // Keep default on error
    }
  };

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
      // Store user in localStorage for persistence across refreshes
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
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
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, register, logout, isAuthenticated: Boolean(token), subscription, usage, refreshSubscription: fetchSubscription, refreshUsage: fetchUsage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
