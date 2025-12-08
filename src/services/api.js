import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds for long-running analyses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else if (error.response.status === 429) {
        // Rate limited
        console.error('Rate limit exceeded. Please try again later.');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Service Functions

/**
 * Portfolio Analysis Endpoints
 */

// Mathematical Analysis
export const getMathCorrelation = async (portfolioId) => {
  const response = await api.get('/math_correlation', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

export const getMathRiskMetrics = async (portfolioId) => {
  const response = await api.get('/math_risk_metrics', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

export const getMathPerformance = async (portfolioId) => {
  const response = await api.get('/math_performance', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

export const getMathVolatility = async (portfolioId) => {
  const response = await api.get('/math_volatility', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

// Optimization Endpoints
export const getRiskDecomposition = async (portfolioId) => {
  const response = await api.get('/optimization/risk_decomposition', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

export const getStrategyGeneration = async (portfolioId) => {
  const response = await api.get('/optimization/strategy_generation', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

export const getImplementation = async (portfolioId, strategyName) => {
  const response = await api.get('/optimization/implementation', {
    params: { 
      portfolio_id: portfolioId,
      strategy: strategyName 
    }
  });
  return response.data;
};

export const getStressTesting = async (portfolioId) => {
  const response = await api.get('/optimization/stress_testing', {
    params: { portfolio_id: portfolioId }
  });
  return response.data;
};

/**
 * Fetch all analysis data in one call
 * This aggregates all endpoints for efficiency
 */
export const getCompleteAnalysis = async (portfolioId) => {
  try {
    const [
      correlation,
      riskMetrics,
      performance,
      volatility,
      riskDecomposition,
      strategies,
      stressTesting
    ] = await Promise.all([
      getMathCorrelation(portfolioId),
      getMathRiskMetrics(portfolioId),
      getMathPerformance(portfolioId),
      getMathVolatility(portfolioId),
      getRiskDecomposition(portfolioId),
      getStrategyGeneration(portfolioId),
      getStressTesting(portfolioId),
    ]);

    return {
      correlation,
      riskMetrics,
      performance,
      volatility,
      riskDecomposition,
      strategies,
      stressTesting,
    };
  } catch (error) {
    console.error('Error fetching complete analysis:', error);
    throw error;
  }
};

/**
 * Portfolio Management Endpoints (if you add these later)
 */
export const createPortfolio = async (portfolioData) => {
  const response = await api.post('/portfolio', portfolioData);
  return response.data;
};

export const updatePortfolio = async (portfolioId, portfolioData) => {
  const response = await api.put(`/portfolio/${portfolioId}`, portfolioData);
  return response.data;
};

export const deletePortfolio = async (portfolioId) => {
  const response = await api.delete(`/portfolio/${portfolioId}`);
  return response.data;
};

export const listPortfolios = async () => {
  const response = await api.get('/portfolios');
  return response.data;
};

/**
 * User Management (if needed)
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Health Check
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Export the axios instance for direct use if needed
export default api;
