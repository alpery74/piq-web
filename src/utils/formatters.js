/**
 * Format number as percentage
 * @param {number} value - Decimal value (e.g., 0.16 for 16%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format number as currency
 * @param {number} value - Dollar amount
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} value - Number to format
 * @returns {string} Formatted number
 */
export const formatLargeNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value);
};

/**
 * Format number with commas
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Get risk level classification
 * @param {string} level - Risk level string
 * @returns {object} Color and label info
 */
export const getRiskLevel = (level) => {
  const levels = {
    LOW: {
      color: 'text-green-700 bg-green-100',
      emoji: '🟢',
      label: 'Low',
    },
    MODERATE: {
      color: 'text-amber-700 bg-amber-100',
      emoji: '🟡',
      label: 'Moderate',
    },
    HIGH: {
      color: 'text-red-700 bg-red-100',
      emoji: '🔴',
      label: 'High',
    },
  };
  
  return levels[level?.toUpperCase()] || levels.MODERATE;
};

/**
 * Get action type classification
 * @param {string} action - Action string (INCREASE, DECREASE, HOLD)
 * @returns {object} Color and icon info
 */
export const getActionType = (action) => {
  const actions = {
    INCREASE: {
      color: 'text-green-700 bg-green-100',
      icon: '↑',
      label: 'Increase',
    },
    DECREASE: {
      color: 'text-red-700 bg-red-100',
      icon: '↓',
      label: 'Reduce',
    },
    REDUCE: {
      color: 'text-red-700 bg-red-100',
      icon: '↓',
      label: 'Reduce',
    },
    HOLD: {
      color: 'text-blue-700 bg-blue-100',
      icon: '→',
      label: 'Hold',
    },
  };
  
  return actions[action?.toUpperCase()] || actions.HOLD;
};

/**
 * Calculate portfolio health score
 * @param {object} data - Analysis data
 * @returns {number} Score from 0-100
 */
export const calculateHealthScore = (data) => {
  let score = 100;
  
  // Penalize for high concentration
  if (data.riskMetrics?.alpha_book_hhi_score > 0.15) {
    score -= 15;
  } else if (data.riskMetrics?.alpha_book_hhi_score > 0.10) {
    score -= 10;
  }
  
  // Penalize for high volatility
  if (data.volatility?.predictive_volatility_annualized_pct > 0.25) {
    score -= 15;
  } else if (data.volatility?.predictive_volatility_annualized_pct > 0.20) {
    score -= 10;
  }
  
  // Penalize for high tail risk
  if (data.stressTesting?.tail_risk_assessment?.tail_risk_level === 'HIGH') {
    score -= 10;
  }
  
  // Penalize for poor diversification
  if (data.riskMetrics?.alpha_book_effective_holdings < 5) {
    score -= 10;
  }
  
  // Bonus for good characteristics
  if (data.riskMetrics?.alpha_book_effective_holdings > 10) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get color for correlation value
 * @param {number} value - Correlation value (-1 to 1)
 * @returns {string} Tailwind color class
 */
export const getCorrelationColor = (value) => {
  if (value > 0.7) return 'bg-red-500';
  if (value > 0.4) return 'bg-orange-500';
  if (value > 0.1) return 'bg-yellow-500';
  if (value > -0.1) return 'bg-gray-300';
  if (value > -0.4) return 'bg-blue-300';
  if (value > -0.7) return 'bg-blue-500';
  return 'bg-blue-700';
};

/**
 * Format date
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format time ago
 * @param {string} dateString - ISO date string
 * @returns {string} Time ago string
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

/**
 * Get ticker display name (handles special cases)
 * @param {string} ticker - Stock ticker
 * @returns {string} Display name
 */
export const getTickerDisplay = (ticker) => {
  // Handle special tickers
  const specialTickers = {
    'SPY': 'S&P 500 ETF',
    'QQQ': 'Nasdaq ETF',
    'DOG': 'Short S&P 500',
  };
  
  return specialTickers[ticker] || ticker;
};

/**
 * Classify market cap tier
 * @param {number} marketCap - Market capitalization
 * @returns {string} Tier label
 */
export const getMarketCapTier = (marketCap) => {
  if (marketCap >= 200e9) return 'Mega Cap';
  if (marketCap >= 10e9) return 'Large Cap';
  if (marketCap >= 2e9) return 'Mid Cap';
  if (marketCap >= 300e6) return 'Small Cap';
  if (marketCap >= 50e6) return 'Micro Cap';
  return 'Nano Cap';
};

/**
 * Sort array by multiple keys
 * @param {Array} array - Array to sort
 * @param {Array} keys - Array of key names
 * @param {Array} orders - Array of 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const multiSort = (array, keys, orders) => {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i] === 'desc' ? -1 : 1;
      
      if (a[key] < b[key]) return -1 * order;
      if (a[key] > b[key]) return 1 * order;
    }
    return 0;
  });
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
