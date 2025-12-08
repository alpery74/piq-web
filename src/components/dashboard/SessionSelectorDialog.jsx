import { useEffect, useMemo, useState } from 'react';
import { X, Play, RefreshCw, Clock } from 'lucide-react';
import { DEFAULT_HOLDINGS, fetchPortfolioLibrary, startAnalysis } from '@/services/analysisService';
import { formatDate } from '@/utils/formatters';

const SessionSelectorDialog = ({ open, onClose, onSelectRun }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [runIdInput, setRunIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startingAnalysis, setStartingAnalysis] = useState(false);

  const lastRunId = useMemo(() => localStorage.getItem('analysisRunId') || '', []);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const selectRunAndClose = (runId) => {
    if (!runId) return;
    localStorage.setItem('analysisRunId', runId);
    onSelectRun(runId);
    onClose();
  };

  const handleAttachRunId = () => {
    if (!runIdInput.trim()) return;
    setError(null);
    selectRunAndClose(runIdInput.trim());
  };

  const handleSelectPortfolio = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
    const portfolio = portfolios.find((p) => p.portfolioId === Number(portfolioId));
    const version = portfolio?.versions?.[0];
    if (version?.versionId) setSelectedVersionId(String(version.versionId));
    if (version?.analysisRunId) {
      setRunIdInput(version.analysisRunId);
      selectRunAndClose(version.analysisRunId);
    }
  };

  const handleSelectVersion = (versionId) => {
    setSelectedVersionId(versionId);
    const portfolio = portfolios.find((p) => p.portfolioId === Number(selectedPortfolioId));
    const version = portfolio?.versions?.find((v) => v.versionId === Number(versionId));
    if (version?.analysisRunId) {
      setRunIdInput(version.analysisRunId);
      selectRunAndClose(version.analysisRunId);
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
        selectRunAndClose(runId);
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

  const selectedPortfolio = portfolios.find((p) => p.portfolioId === Number(selectedPortfolioId));
  const versions = selectedPortfolio?.versions || [];

  const dialogContent = (
    <div
      className="w-full h-full md:h-auto md:max-w-4xl bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Analysis session selector"
    >
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Analysis session</p>
          <h2 className="text-lg font-bold text-gray-900" id="selector-title">Switch or start an analysis</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100"
          aria-label="Close selector"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" aria-labelledby="selector-title">
        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => selectRunAndClose(lastRunId)}
            disabled={!lastRunId}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-primary-200 hover:shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Continue last analysis run"
          >
            <Clock className="w-5 h-5 text-primary-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Continue last run</p>
              <p className="text-xs text-gray-600">
                {lastRunId ? lastRunId : 'No previous run found'}
              </p>
            </div>
          </button>

          <button
            onClick={handleStartNew}
            disabled={startingAnalysis}
            className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 shadow-sm hover:border-primary-300 hover:bg-primary-100 transition disabled:opacity-60"
            aria-label={startingAnalysis ? 'Starting new analysis' : 'Start new analysis'}
          >
            <Play className="w-5 h-5 text-primary-700" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                {startingAnalysis ? 'Starting…' : 'Start new analysis'}
              </p>
              <p className="text-xs text-gray-600">Uses demo holdings if none saved</p>
            </div>
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 flex items-center gap-2" role="status">
          <RefreshCw className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span>{loading ? 'Loading portfolios…' : `${portfolios.length || 0} portfolios available`}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-3" aria-label="Portfolio and version selection">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="selector-portfolio">Portfolio</label>
            <select
              id="selector-portfolio"
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
            <label className="text-xs font-semibold text-gray-700" htmlFor="selector-version">Version / run</label>
            <select
              id="selector-version"
              value={selectedVersionId}
              onChange={(e) => handleSelectVersion(e.target.value)}
              disabled={!selectedPortfolioId}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select version</option>
              {versions.map((v) => (
                <option key={v.versionId} value={v.versionId}>
                  {v.versionName || 'Analysis'} — {v.analysisRunId} {v.createdAt ? `(${formatDate(v.createdAt)})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm">
      {dialogContent}
    </div>
  );
};

export default SessionSelectorDialog;
