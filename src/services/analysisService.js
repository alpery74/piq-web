import client from './client';

const snakeToCamel = (value) => {
  if (Array.isArray(value)) {
    return value.map(snakeToCamel);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      // Convert snake_case to camelCase, handling underscores before letters AND numbers
      // e.g., "historical_var_95_daily_pct" -> "historicalVar95DailyPct"
      const camelKey = key
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/_(\d)/g, (_, d) => d); // Remove underscores before numbers
      acc[camelKey] = snakeToCamel(val);
      return acc;
    }, {});
  }
  return value;
};

export const startAnalysis = async (holdings, portfolioName = 'Web Demo', versionName = 'v1') => {
  const payload = {
    holdings: holdings.map((h) => ({ ticker: h.ticker, shares: h.shares })),
    portfolio_name: portfolioName,
    version_name: versionName,
  };

  const response = await client.post('/analyze-portfolio', payload);
  return response.data;
};

export const pollUnifiedResults = async (analysisRunId, since) => {
  const params = since ? { since } : {};
  const response = await client.get(`/session/${analysisRunId}/results`, { params });
  const data = response.data || {};

  if (data.results) {
    const parsed = {};
    Object.entries(data.results).forEach(([subtool, result]) => {
      // Handle format: {status: 'ready', result: '...JSON string...'}
      if (result?.status === 'ready' && result.result) {
        try {
          const resultData = typeof result.result === 'string'
            ? JSON.parse(result.result)
            : result.result;
          parsed[subtool] = snakeToCamel(resultData);
        } catch {
          // Skip unparseable results
        }
      } else if (result && typeof result === 'object' && !('status' in result)) {
        // Direct object format - no wrapper
        parsed[subtool] = snakeToCamel(result);
      }
    });
    return {
      ...data,
      parsedResults: parsed,
    };
  }
  return data;
};

export const fetchPortfolioLibrary = async () => {
  const response = await client.get('/portfolio-library');
  const payload = response.data || {};
  const data = payload.data || payload;
  return Array.isArray(data) ? snakeToCamel(data) : [];
};

export const DEFAULT_HOLDINGS = [
  { ticker: 'BRX', shares: 10 },
  { ticker: 'CHX', shares: 12 },
  { ticker: 'LW', shares: 8 },
  { ticker: 'O', shares: 14 },
  { ticker: 'PPL', shares: 11 },
  { ticker: 'DOG', shares: 6 },
  { ticker: 'YHC', shares: 5 },
  { ticker: 'YNDX', shares: 9 },
  { ticker: 'XP', shares: 7 },
];
