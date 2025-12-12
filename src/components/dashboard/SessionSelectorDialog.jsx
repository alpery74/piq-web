import { useEffect, useMemo, useState } from 'react';
import { X, Play, Clock, Plus, ChevronDown, Folder, ArrowRight, Sparkles, BarChart3, Shield, TrendingUp, Link2 } from 'lucide-react';
import { fetchPortfolioLibrary, startAnalysis, DEFAULT_HOLDINGS } from '@/services/analysisService';
import { formatDate } from '@/utils/formatters';

// Portfolio Card Component
const PortfolioCard = ({ portfolio, onSelectVersion, onNewRun, isExpanded, onToggle }) => {
  const versions = portfolio.versions || [];
  const latestVersion = versions[0];
  const versionCount = versions.length;

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-slate-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-primary-50 hover:to-white dark:hover:from-primary-900/20 dark:hover:to-gray-800 transition-colors"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Folder className="w-6 h-6 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{portfolio.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {versionCount} {versionCount === 1 ? 'run' : 'runs'}
            {latestVersion?.createdAt && ` · Last: ${formatDate(latestVersion.createdAt)}`}
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNewRun(portfolio);
          }}
          className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          New Run
        </button>

        <ChevronDown
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded Version List */}
      {isExpanded && versions.length > 0 && (
        <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            {versions.map((version, idx) => (
              <button
                key={version.versionId}
                onClick={() => onSelectVersion(version.analysisRunId)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
              >
                {/* Recent indicator */}
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-green-500 ring-2 ring-green-200 dark:ring-green-800' : 'bg-gray-300 dark:bg-gray-600'}`} />

                {/* Version info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {version.versionName || 'Analysis'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {version.createdAt && formatDate(version.createdAt)}
                    {version.holdingsCount && ` · ${version.holdingsCount} holdings`}
                  </p>
                </div>

                {/* Resume button */}
                <span className="px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors flex items-center gap-1">
                  Resume
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onCreatePortfolio, onQuickDemo, startingDemo }) => (
  <div className="text-center py-5 sm:py-8 px-4">
    {/* Decorative Icon */}
    <div className="relative inline-flex mb-4 sm:mb-6">
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
        <BarChart3 className="w-12 h-12 text-white" />
      </div>
      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
    </div>

    {/* Heading */}
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Welcome to PIQ Labs
    </h2>
    <p className="text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-8 max-w-sm mx-auto">
      Create your first portfolio to unlock AI-powered investment insights and analysis.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-10">
      <button
        onClick={onCreatePortfolio}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-5 h-5" />
        Create Your First Portfolio
      </button>
      <button
        onClick={onQuickDemo}
        disabled={startingDemo}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold text-lg border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
      >
        <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
        {startingDemo ? 'Starting...' : 'Try Quick Demo'}
      </button>
    </div>

    {/* Feature highlights */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800">
        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mx-auto mb-3 shadow-md">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Risk Analysis</p>
      </div>
      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-100 dark:border-purple-800">
        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mx-auto mb-3 shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">AI Insights</p>
      </div>
      <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-100 dark:border-green-800">
        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center mx-auto mb-3 shadow-md">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Optimization</p>
      </div>
    </div>
  </div>
);

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-3 py-4">
    {[1, 2].map((i) => (
      <div key={i} className="rounded-2xl bg-white/50 dark:bg-gray-700/50 p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-600" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Main Component
const SessionSelectorDialog = ({ open, onClose, onSelectRun, onStartNewAnalysis, userName, embedded = false }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startingDemo, setStartingDemo] = useState(false);
  const [expandedPortfolioId, setExpandedPortfolioId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [runIdInput, setRunIdInput] = useState('');

  const lastRunId = useMemo(() => localStorage.getItem('analysisRunId') || '', []);

  // Load portfolios when open (modal) or mounted (embedded)
  const shouldLoad = embedded || open;

  useEffect(() => {
    if (!shouldLoad) return;
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const library = await fetchPortfolioLibrary();
        if (!active) return;
        setPortfolios(library || []);
        // Auto-expand first portfolio
        if (library?.[0]?.portfolioId) {
          setExpandedPortfolioId(library[0].portfolioId);
        }
      } catch {
        if (active) setError('Unable to load portfolios.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [shouldLoad]);

  const selectRunAndClose = (runId) => {
    if (!runId) return;
    localStorage.setItem('analysisRunId', runId);
    onSelectRun(runId);
    if (!embedded) onClose?.();
  };

  const handleQuickDemo = async () => {
    try {
      setStartingDemo(true);
      setError(null);
      const response = await startAnalysis(DEFAULT_HOLDINGS, 'Quick Demo', 'demo');
      const runId = response?.analysis_run_id || response?.analysisRunId || response?.data?.analysis_run_id;
      if (runId) {
        selectRunAndClose(runId);
      } else {
        setError('Unable to start demo. Please try again.');
      }
    } catch {
      setError('Unable to start demo. Please try again.');
    } finally {
      setStartingDemo(false);
    }
  };

  const handleNewPortfolio = () => {
    if (!embedded) onClose?.();
    onStartNewAnalysis?.();
  };

  const handleNewRun = (portfolio) => {
    if (!embedded) onClose?.();
    onStartNewAnalysis?.(portfolio);
  };

  const handleLoadRunId = () => {
    if (runIdInput.trim()) {
      selectRunAndClose(runIdInput.trim());
    }
  };

  const hasPortfolios = portfolios.length > 0;
  const displayName = userName || 'there';

  // For modal mode, don't render if not open
  if (!embedded && !open) return null;

  // Embedded mode: render directly in page
  if (embedded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <LoadingSkeleton />
            ) : !hasPortfolios ? (
              <EmptyState
                onCreatePortfolio={handleNewPortfolio}
                onQuickDemo={handleQuickDemo}
                startingDemo={startingDemo}
              />
            ) : (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Continue Last */}
                  <button
                    onClick={() => selectRunAndClose(lastRunId)}
                    disabled={!lastRunId}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Continue</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[100px]">
                        {lastRunId ? 'Last run' : 'No history'}
                      </p>
                    </div>
                  </button>

                  {/* New Portfolio */}
                  <button
                    onClick={handleNewPortfolio}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <Plus className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">New</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">Portfolio</p>
                    </div>
                  </button>

                  {/* Quick Demo */}
                  <button
                    onClick={handleQuickDemo}
                    disabled={startingDemo}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 hover:border-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all disabled:opacity-50 shadow-sm hover:shadow-md group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {startingDemo ? 'Starting...' : 'Demo'}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">Sample data</p>
                    </div>
                  </button>
                </div>

                {/* Portfolio List Header */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Your Portfolios
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{portfolios.length} total</span>
                </div>

                {/* Portfolio Cards */}
                <div className="space-y-4">
                  {portfolios.map((portfolio) => (
                    <PortfolioCard
                      key={portfolio.portfolioId}
                      portfolio={portfolio}
                      isExpanded={expandedPortfolioId === portfolio.portfolioId}
                      onToggle={() => setExpandedPortfolioId(
                        expandedPortfolioId === portfolio.portfolioId ? null : portfolio.portfolioId
                      )}
                      onSelectVersion={selectRunAndClose}
                      onNewRun={handleNewRun}
                    />
                  ))}
                </div>

                {/* Advanced Section */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Have a run ID?</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  {showAdvanced && (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={runIdInput}
                        onChange={(e) => setRunIdInput(e.target.value)}
                        placeholder="Enter run ID..."
                        className="flex-1 px-4 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 dark:focus:border-primary-600"
                      />
                      <button
                        onClick={handleLoadRunId}
                        disabled={!runIdInput.trim()}
                        className="px-5 py-3 text-sm font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        Load
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Feature highlights for embedded mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Risk Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">VaR, CVaR, stress testing, and Monte Carlo simulations</p>
          </div>
          <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Natural language explanations of complex metrics</p>
          </div>
          <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Optimization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio rebalancing and strategy recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  // Modal mode
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div
        className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-white dark:bg-gray-800 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div>
            <h2 className="text-xl font-bold text-white">
              {hasPortfolios ? `Welcome back${userName ? `, ${userName}` : ''}` : 'Get Started'}
            </h2>
            <p className="text-sm text-indigo-100">
              {hasPortfolios ? 'Pick up where you left off or start something new' : 'Create your first portfolio to begin'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 dark:bg-gray-900">
          {loading ? (
            <LoadingSkeleton />
          ) : !hasPortfolios ? (
            <EmptyState
              onCreatePortfolio={handleNewPortfolio}
              onQuickDemo={handleQuickDemo}
              startingDemo={startingDemo}
            />
          ) : (
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Continue Last */}
                <button
                  onClick={() => selectRunAndClose(lastRunId)}
                  disabled={!lastRunId}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Continue</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[80px]">
                      {lastRunId ? 'Last run' : 'No history'}
                    </p>
                  </div>
                </button>

                {/* New Portfolio */}
                <button
                  onClick={handleNewPortfolio}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">New</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">Portfolio</p>
                  </div>
                </button>

                {/* Quick Demo */}
                <button
                  onClick={handleQuickDemo}
                  disabled={startingDemo}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all disabled:opacity-50 shadow-sm hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {startingDemo ? 'Starting...' : 'Demo'}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">Sample data</p>
                  </div>
                </button>
              </div>

              {/* Portfolio List Header */}
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Your Portfolios
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">{portfolios.length} total</span>
              </div>

              {/* Portfolio Cards */}
              <div className="space-y-3">
                {portfolios.map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.portfolioId}
                    portfolio={portfolio}
                    isExpanded={expandedPortfolioId === portfolio.portfolioId}
                    onToggle={() => setExpandedPortfolioId(
                      expandedPortfolioId === portfolio.portfolioId ? null : portfolio.portfolioId
                    )}
                    onSelectVersion={selectRunAndClose}
                    onNewRun={handleNewRun}
                  />
                ))}
              </div>

              {/* Advanced Section */}
              <div className="pt-2">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Have a run ID?</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                {showAdvanced && (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={runIdInput}
                      onChange={(e) => setRunIdInput(e.target.value)}
                      placeholder="Enter run ID..."
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 dark:focus:border-primary-600"
                    />
                    <button
                      onClick={handleLoadRunId}
                      disabled={!runIdInput.trim()}
                      className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Load
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionSelectorDialog;
