import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  FolderPlus,
  Play,
  AlertCircle,
  Loader2,
  TrendingUp,
  Building2,
  DollarSign,
  Percent,
  Info,
  Sparkles,
  Check,
} from 'lucide-react';
import api from '@/services/client';
import { formatLargeNumber } from '@/utils/formatters';

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Step indicator component
const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
            index < currentStep
              ? 'bg-green-500 text-white'
              : index === currentStep
              ? 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-900'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
        </div>
        {index < steps.length - 1 && (
          <div
            className={`w-12 h-1 mx-2 rounded ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// Ticker search result item
const SearchResultItem = ({ result, onSelect }) => (
  <button
    onClick={() => onSelect(result)}
    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
  >
    <div className="flex-shrink-0 w-14 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-xs">{result.ticker}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-gray-900 dark:text-white truncate">
        {result.name || result.ticker}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        {result.sector && <span>{result.sector}</span>}
        {result.marketCap && (
          <>
            <span>•</span>
            <span>{formatLargeNumber(result.marketCap)}</span>
          </>
        )}
      </div>
    </div>
    <Plus className="w-5 h-5 text-blue-500 flex-shrink-0" />
  </button>
);

// Selected stock row
const SelectedStockRow = ({ stock, onUpdateShares, onRemove, weight, sharesInputRef, isLatest }) => {
  const [sharesInput, setSharesInput] = useState(stock.shares?.toString() || '');
  const inputRef = useRef(null);

  // Auto-focus when this is the latest added stock
  useEffect(() => {
    if (isLatest && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isLatest]);

  const handleSharesChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setSharesInput(value);
      onUpdateShares(stock.ticker, value === '' ? 0 : parseInt(value, 10));
    }
  };

  const value = (stock.currentPrice || 0) * (stock.shares || 0);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      isLatest
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-xs">{stock.ticker}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 dark:text-white truncate text-sm">
          {stock.name || stock.ticker}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}/share` : 'Price loading...'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={sharesInput}
            onChange={handleSharesChange}
            placeholder="0"
            className={`w-20 px-3 py-2 text-right font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
              isLatest ? 'border-blue-400 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <div className="text-xs text-gray-500 mt-1">shares</div>
        </div>

        <div className="text-right w-24">
          <div className="font-semibold text-gray-900 dark:text-white text-sm">
            {formatLargeNumber(value)}
          </div>
          <div className="text-xs text-gray-500">{weight.toFixed(1)}%</div>
        </div>

        <button
          onClick={() => onRemove(stock.ticker)}
          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Empty state for stock selection
const EmptyStockState = () => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-blue-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Start Building Your Portfolio
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-4">
      Use the search bar above to find and add your first stock. You can add multiple stocks to create a diversified portfolio.
    </p>
    <div className="flex flex-wrap justify-center gap-2 text-xs">
      <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
        Search by ticker (AAPL)
      </span>
      <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
        Search by name (Apple)
      </span>
    </div>
  </div>
);

// Main Modal Component
const NewAnalysisModal = ({ isOpen, onClose, onAnalysisStarted }) => {
  // Steps configuration
  const STEPS = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'review', label: 'Review' },
  ];

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Portfolio state
  const [portfolioLibrary, setPortfolioLibrary] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isNewPortfolio, setIsNewPortfolio] = useState(true);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newVersionName, setNewVersionName] = useState('');

  // User limits state
  const [userLimits, setUserLimits] = useState(null);

  // Stock selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [latestAddedTicker, setLatestAddedTicker] = useState(null);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch portfolio library and user limits on mount
  useEffect(() => {
    if (isOpen) {
      fetchPortfolioLibrary();
      fetchUserLimits();
    }
  }, [isOpen]);

  // Search companies when query changes
  useEffect(() => {
    if (debouncedSearchQuery.length >= 1) {
      searchCompanies(debouncedSearchQuery);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [debouncedSearchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPortfolioLibrary = async () => {
    try {
      const response = await api.get('/portfolio-library');
      if (response.data.success) {
        const portfolios = response.data.data || [];
        setPortfolioLibrary(portfolios);
      }
    } catch {
      // Don't show error - just default to new portfolio mode
    }
  };

  const fetchUserLimits = async () => {
    try {
      const response = await api.get('/user-limits');
      if (response.data.success) {
        setUserLimits(response.data.data);
      }
    } catch {
      // Set default limits as fallback
      setUserLimits({ tier_name: 'Free', tier_limits: { max_holdings: 5 } });
    }
  };

  const searchCompanies = async (query) => {
    if (query.length < 1) return;

    setIsSearching(true);
    try {
      const response = await api.get('/companies/search', {
        params: { q: query }
      });

      if (response.data.success) {
        // Filter out already selected stocks
        const selectedTickers = selectedStocks.map(s => s.ticker);
        const results = response.data.data || [];
        const filteredResults = results.filter(
          r => !selectedTickers.includes(r.ticker)
        );
        setSearchResults(filteredResults);
        setShowSearchDropdown(filteredResults.length > 0);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStock = (stock) => {
    // Check tier limits
    const maxHoldings = userLimits?.tier_limits?.max_holdings || 5;
    if (selectedStocks.length >= maxHoldings) {
      setError(`Your plan allows a maximum of ${maxHoldings} stocks. Upgrade to add more.`);
      return;
    }

    setSelectedStocks(prev => [...prev, { ...stock, shares: 0 }]);
    setLatestAddedTicker(stock.ticker); // Track which stock was just added
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
    setError(null);
  };

  const handleUpdateShares = (ticker, shares) => {
    setSelectedStocks(prev =>
      prev.map(stock =>
        stock.ticker === ticker ? { ...stock, shares } : stock
      )
    );
  };

  const handleRemoveStock = (ticker) => {
    setSelectedStocks(prev => prev.filter(stock => stock.ticker !== ticker));
  };

  // Calculate totals and weights
  const totalValue = selectedStocks.reduce(
    (sum, stock) => sum + (stock.currentPrice || 0) * (stock.shares || 0),
    0
  );

  const getStockWeight = (stock) => {
    if (totalValue === 0) return 0;
    const stockValue = (stock.currentPrice || 0) * (stock.shares || 0);
    return (stockValue / totalValue) * 100;
  };

  // Navigation
  const canProceedFromPortfolio = () => {
    if (isNewPortfolio) {
      return newPortfolioName.trim().length > 0;
    }
    return selectedPortfolio !== null;
  };

  const canProceedFromStocks = () => {
    // Require at least 2 stocks for a diversified portfolio
    return selectedStocks.length >= 2 && selectedStocks.every(s => s.shares > 0);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const portfolioName = isNewPortfolio ? newPortfolioName.trim() : selectedPortfolio.name;
      const versionName = newVersionName.trim() || `Analysis ${new Date().toLocaleDateString()}`;

      const holdings = selectedStocks.map(stock => ({
        ticker: stock.ticker,
        shares: stock.shares,
      }));

      const response = await api.post('/analyze-portfolio', {
        portfolio_name: portfolioName,
        version_name: versionName,
        holdings,
      });

      if (response.data.success) {
        onAnalysisStarted?.(response.data.analysis_run_id, response.data.enriched_holdings);
        onClose();
      } else {
        throw new Error(response.data.error || 'Failed to start analysis');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to start analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setCurrentStep(0);
    setSelectedPortfolio(null);
    setIsNewPortfolio(true);
    setNewPortfolioName('');
    setNewVersionName('');
    setSelectedStocks([]);
    setSearchQuery('');
    setSearchResults([]);
    setLatestAddedTicker(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div>
            <h2 className="text-xl font-bold text-white">
              New Analysis
            </h2>
            <p className="text-sm text-white/80">
              {STEPS[currentStep].label}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 dark:bg-gray-900">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}

          {/* Step 1: Portfolio Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Toggle between new and existing */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsNewPortfolio(true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    isNewPortfolio
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FolderPlus className={`w-6 h-6 mx-auto mb-2 ${isNewPortfolio ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div className={`font-semibold ${isNewPortfolio ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    New Portfolio
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Create a new portfolio</div>
                </button>

                <button
                  onClick={() => setIsNewPortfolio(false)}
                  disabled={portfolioLibrary.length === 0}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    !isNewPortfolio
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  } ${portfolioLibrary.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Briefcase className={`w-6 h-6 mx-auto mb-2 ${!isNewPortfolio ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div className={`font-semibold ${!isNewPortfolio ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Existing Portfolio
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {portfolioLibrary.length > 0 ? `${portfolioLibrary.length} portfolios` : 'No portfolios yet'}
                  </div>
                </button>
              </div>

              {/* New Portfolio Form */}
              {isNewPortfolio && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portfolio Name *
                    </label>
                    <input
                      type="text"
                      value={newPortfolioName}
                      onChange={(e) => setNewPortfolioName(e.target.value)}
                      placeholder="e.g., 401(k), Retirement, Growth Portfolio"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Version Name (optional)
                    </label>
                    <input
                      type="text"
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                      placeholder="e.g., Tech Heavy, Conservative, Q4 2024"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to auto-generate a name
                    </p>
                  </div>
                </div>
              )}

              {/* Existing Portfolio Selection */}
              {!isNewPortfolio && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Portfolio
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {portfolioLibrary.map((portfolio) => (
                        <button
                          key={portfolio.portfolioId}
                          onClick={() => setSelectedPortfolio(portfolio)}
                          className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                            selectedPortfolio?.portfolioId === portfolio.portfolioId
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {portfolio.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {portfolio.versions?.length || 0} version{portfolio.versions?.length !== 1 ? 's' : ''} • Last modified {new Date(portfolio.lastModified).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPortfolio && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Version Name
                      </label>
                      <input
                        type="text"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        placeholder="e.g., Rebalanced, Q1 2025"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Stock Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Tier Limit Info */}
              {userLimits && (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {userLimits.tier_name} Plan
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {selectedStocks.length} / {userLimits.tier_limits?.max_holdings || 5} stocks
                  </span>
                </div>
              )}

              {/* Search Input */}
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    placeholder="Search by ticker or company name..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {searchResults.map((result) => (
                      <SearchResultItem
                        key={result.ticker}
                        result={result}
                        onSelect={handleSelectStock}
                      />
                    ))}
                  </div>
                )}

                {/* No Results */}
                {showSearchDropdown && searchQuery.length >= 1 && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Stocks List */}
              {selectedStocks.length === 0 ? (
                <EmptyStockState />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Selected Stocks ({selectedStocks.length})
                    </h3>
                    <div className="text-sm text-gray-500">
                      Total: <span className="font-semibold text-gray-900 dark:text-white">{formatLargeNumber(totalValue)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedStocks.map((stock, index) => (
                      <SelectedStockRow
                        key={stock.ticker}
                        stock={stock}
                        onUpdateShares={handleUpdateShares}
                        onRemove={handleRemoveStock}
                        weight={getStockWeight(stock)}
                        isLatest={stock.ticker === latestAddedTicker}
                      />
                    ))}
                  </div>

                  {/* Hint when only 1 stock is selected */}
                  {selectedStocks.length === 1 && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Add at least one more stock
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                          A diversified portfolio requires at least 2 stocks. Use the search bar above to add more holdings.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Ready indicator when requirements are met */}
                  {selectedStocks.length >= 2 && selectedStocks.every(s => s.shares > 0) && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <Check className="w-5 h-5 text-green-500" />
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Ready to proceed! You can add more stocks or continue to review.
                      </p>
                    </div>
                  )}

                  {/* Reminder about entering shares */}
                  {selectedStocks.length >= 2 && selectedStocks.some(s => s.shares === 0) && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Enter the number of shares for each stock to continue.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Portfolio Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Portfolio Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Portfolio Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {isNewPortfolio ? newPortfolioName : selectedPortfolio?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Version Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {newVersionName || `Analysis ${new Date().toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Holdings Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Holdings Summary
                </h3>
                <div className="space-y-2">
                  {selectedStocks.map((stock) => (
                    <div key={stock.ticker} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {stock.ticker}
                        </span>
                        <span className="text-gray-500">
                          × {stock.shares} shares
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 dark:text-white">
                          {formatLargeNumber((stock.currentPrice || 0) * stock.shares)}
                        </span>
                        <span className="text-gray-500 w-12 text-right">
                          {getStockWeight(stock).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total Portfolio Value</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatLargeNumber(totalValue)}</span>
                  </div>
                </div>
              </div>

              {/* What You'll Get */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What You'll Get
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    Risk Analysis
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    Correlation Matrix
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    Optimization Strategies
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    Stress Testing
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={currentStep === 0 ? handleClose : handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {currentStep === 0 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Back
              </>
            )}
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !canProceedFromPortfolio()) ||
                (currentStep === 1 && !canProceedFromStocks())
              }
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStartAnalysis}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewAnalysisModal;
