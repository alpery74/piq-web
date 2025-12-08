import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_HOLDINGS, fetchPortfolioLibrary, startAnalysis } from '@/services/analysisService';

const SessionSelector = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [runIdInput, setRunIdInput] = useState(localStorage.getItem('analysisRunId') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startingAnalysis, setStartingAnalysis] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const library = await fetchPortfolioLibrary();
        if (!active) return;
        setPortfolios(library || []);
        const firstPortfolio = library?.[0];
        const firstVersion = firstPortfolio?.versions?.[0];
        if (firstPortfolio?.portfolioId) setSelectedPortfolioId(String(firstPortfolio.portfolioId));
        if (firstVersion?.versionId) setSelectedVersionId(String(firstVersion.versionId));
      } catch (err) {
        console.error('Failed to load portfolios', err);
        if (active) setError('Unable to load portfolios. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const selectRunAndGo = (runId) => {
    if (!runId) return;
    localStorage.setItem('analysisRunId', runId);
    navigate('/');
  };

  const handleAttachRunId = () => {
    if (!runIdInput.trim()) return;
    setError(null);
    selectRunAndGo(runIdInput.trim());
  };

  const handleSelectPortfolio = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
    const portfolio = portfolios.find((p) => p.portfolioId === Number(portfolioId));
    const version = portfolio?.versions?.[0];
    if (version?.versionId) setSelectedVersionId(String(version.versionId));
    if (version?.analysisRunId) {
      setRunIdInput(version.analysisRunId);
      selectRunAndGo(version.analysisRunId);
    }
  };

  const handleSelectVersion = (versionId) => {
    setSelectedVersionId(versionId);
    const portfolio = portfolios.find((p) => p.portfolioId === Number(selectedPortfolioId));
    const version = portfolio?.versions?.find((v) => v.versionId === Number(versionId));
    if (version?.analysisRunId) {
      setRunIdInput(version.analysisRunId);
      selectRunAndGo(version.analysisRunId);
    }
  };

  const handleStartNew = async () => {
    try {
      setStartingAnalysis(true);
      setError(null);
      const response = await startAnalysis(DEFAULT_HOLDINGS, 'Web Demo', 'web-auto');
      const runId =
        response?.analysis_run_id ||
        response?.analysisRunId ||
        response?.data?.analysis_run_id ||
        response?.analysis_run ||
        response?.session_id;
      if (runId) {
        setRunIdInput(runId);
        selectRunAndGo(runId);
      } else {
        setError('Unable to start analysis. No run ID returned.');
      }
    } catch (err) {
      console.error('Failed to start analysis', err);
      setError('Unable to start analysis. Please try again.');
    } finally {
      setStartingAnalysis(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Select an analysis session</h1>
            <p className="text-sm text-gray-600">Pick a portfolio/version or attach a run ID; you can always start fresh.</p>
          </div>
          <div className="text-xs text-gray-500">{loading ? 'Loading portfolios…' : `${portfolios.length || 0} portfolios`}</div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Portfolio</label>
            <select
              value={selectedPortfolioId}
              onChange={(e) => handleSelectPortfolio(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select portfolio</option>
              {portfolios.map((p) => (
                <option key={p.portfolioId} value={p.portfolioId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Version / run</label>
            <select
              value={selectedVersionId}
              onChange={(e) => handleSelectVersion(e.target.value)}
              disabled={!selectedPortfolioId}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select version</option>
              {(portfolios.find((p) => p.portfolioId === Number(selectedPortfolioId))?.versions || []).map((v) => (
                <option key={v.versionId} value={v.versionId}>
                  {v.versionName || 'Analysis'} — {v.analysisRunId}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Manual run ID</label>
            <div className="flex gap-2">
              <input
                value={runIdInput}
                onChange={(e) => setRunIdInput(e.target.value)}
                placeholder="Enter run ID"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={handleAttachRunId}
                className="px-3 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:border-primary-200 hover:text-primary-700 transition"
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-end mt-4">
          <button
            onClick={handleStartNew}
            disabled={startingAnalysis}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white shadow-sm hover:bg-primary-700 transition disabled:opacity-60"
          >
            {startingAnalysis ? 'Starting…' : 'Start new analysis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSelector;
