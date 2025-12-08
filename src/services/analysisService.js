import client from './client';

const snakeToCamel = (value) => {
  if (Array.isArray(value)) {
    return value.map(snakeToCamel);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
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
      if (result?.status === 'ready' && result.result) {
        try {
          parsed[subtool] = snakeToCamel(JSON.parse(result.result));
        } catch (err) {
          console.error('Failed to parse subtool result', subtool, err);
        }
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
