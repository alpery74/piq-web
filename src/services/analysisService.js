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

  console.log('[pollUnifiedResults] Raw API response keys:', Object.keys(data));
  console.log('[pollUnifiedResults] Has results?', !!data.results, 'Results keys:', data.results ? Object.keys(data.results) : []);

  if (data.results) {
    const parsed = {};
    Object.entries(data.results).forEach(([subtool, result]) => {
      console.log(`[pollUnifiedResults] Subtool "${subtool}":`, {
        type: typeof result,
        hasStatus: result && 'status' in result,
        status: result?.status,
        hasResultField: result && 'result' in result,
        resultFieldType: typeof result?.result,
      });

      // Handle format: {status: 'ready', result: '...JSON string...'}
      if (result?.status === 'ready' && result.result) {
        try {
          const resultData = typeof result.result === 'string'
            ? JSON.parse(result.result)
            : result.result;
          parsed[subtool] = snakeToCamel(resultData);
          console.log(`[pollUnifiedResults] ✅ Parsed ${subtool}, keys:`, Object.keys(parsed[subtool]).slice(0, 5));
        } catch (err) {
          console.error(`[pollUnifiedResults] ❌ Failed to parse ${subtool}:`, err.message);
        }
      } else if (result?.status && result.status !== 'ready') {
        console.log(`[pollUnifiedResults] ⏳ ${subtool} status: ${result.status}`);
      } else if (result && typeof result === 'object' && !('status' in result)) {
        // Direct object format - no wrapper (unlikely based on iOS code)
        parsed[subtool] = snakeToCamel(result);
        console.log(`[pollUnifiedResults] ✅ Direct parsed ${subtool}`);
      }
    });
    console.log('[pollUnifiedResults] Final parsed results:', Object.keys(parsed));
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
