import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AlertCircle, TrendingUp, Activity, Layers, Eye, EyeOff, RefreshCw, Command, Moon, Sun, HelpCircle, BookOpen, ChevronDown, Shield, PieChart, GitBranch, BarChart3, Target, Cog } from 'lucide-react';
import HealthSection from '@/components/dashboard/HealthSection';
import InsightsSection from '@/components/dashboard/InsightsSection';
import HoldingsSection from '@/components/dashboard/HoldingsSection';
import GoalsSection from '@/components/dashboard/GoalsSection';
import WhatIfSimulator from '@/components/dashboard/WhatIfSimulator';
import ImplementationSection from '@/components/dashboard/ImplementationSection';
import RiskOverviewCard from '@/components/dashboard/RiskOverviewCard';
import FundamentalsCard from '@/components/dashboard/FundamentalsCard';
import CorrelationClustersCard from '@/components/dashboard/CorrelationClustersCard';
import StrategyComparisonCard from '@/components/dashboard/StrategyComparisonCard';
import BackendStatus from '@/components/common/BackendStatus';
import HeroCard from '@/components/common/HeroCard';
import CommandPalette, { useCommandPalette } from '@/components/common/CommandPalette';
import OnboardingWizard, { useOnboarding } from '@/components/common/OnboardingWizard';
import MobileBottomNav from '@/components/common/MobileBottomNav';
import LearnMoreModal, { useLearnMore } from '@/components/common/LearnMoreModal';
import { SkeletonHeroCard } from '@/components/common/Skeleton';
import { calculateHealthScore } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import useAnalysisPolling from '@/hooks/useAnalysisPolling';
import SessionSelectorDialog from '@/components/dashboard/SessionSelectorDialog';

// View tier definitions
const VIEW_TIERS = {
  simple: { label: 'Simple', description: 'Key metrics at a glance', icon: Eye },
  analyst: { label: 'Analyst', description: 'Deeper insights & context', icon: TrendingUp },
  quant: { label: 'Quant', description: 'Full data transparency', icon: Layers },
};

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [viewTier, setViewTier] = useState(() => {
    const saved = localStorage.getItem('viewTier');
    return saved && ['simple', 'analyst', 'quant'].includes(saved) ? saved : 'simple';
  });
  // For backward compatibility
  const showAdvanced = viewTier === 'analyst' || viewTier === 'quant';
  const [showOptimizationStrategies, setShowOptimizationStrategies] = useState(false);
  const [analysisRunId, setAnalysisRunId] = useState(localStorage.getItem('analysisRunId') || '');
  const [selectorOpen, setSelectorOpen] = useState(false);
  const selectorOpenedRef = useRef(false);
  const [expandedSections, setExpandedSections] = useState({
    'health-score': true,
    'key-insights': true,
    'risk-breakdown': true,
    'holdings': true
  });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const commandPalette = useCommandPalette();
  const onboarding = useOnboarding();
  const learnMore = useLearnMore();

  const {
    results: polledResults,
    loading: polling,
    error: pollingError,
    progress,
    pending,
    connectionStatus,
    loadingStartTime,
  } = useAnalysisPolling(analysisRunId);

  // Retry handler for backend errors
  const handleRetry = useCallback(() => {
    // Force re-trigger by clearing and re-setting the run ID
    const currentId = analysisRunId;
    setAnalysisRunId('');
    setTimeout(() => setAnalysisRunId(currentId), 100);
  }, [analysisRunId]);

  const pickLive = (liveValue, fallbackValue, requiredKeys = []) => {
    if (!liveValue) return fallbackValue;
    if (requiredKeys.length && requiredKeys.some((key) => liveValue[key] === undefined || liveValue[key] === null)) {
      return fallbackValue;
    }
    return liveValue;
  };

  const liveAnalysis = useMemo(() => ({
    correlation: polledResults.math_correlation,
    riskMetrics: polledResults.math_risk_metrics,
    performance: polledResults.math_performance,
    volatility: polledResults.math_volatility,
    riskDecomposition: polledResults.optimization_risk_decomposition,
    strategies: polledResults.optimization_strategy_generation,
    stressTesting: polledResults.optimization_stress_testing,
    implementation: polledResults.optimization_implementation,
  }), [polledResults]);

  const analysis = useMemo(() => ({
    correlation: pickLive(liveAnalysis.correlation, {
      portfolioMarketBeta: 0,
      portfolioRSquaredWeighted: 0,
      explainedRiskPct: 0,
      unexplainedRiskPct: 0,
      highestBeta: { ticker: 'N/A', value: 0 },
      lowestBeta: { ticker: 'N/A', value: 0 },
      tickers: [],
      correlationMatrix: [],
    }, ['tickers']),
    riskMetrics: pickLive(liveAnalysis.riskMetrics, {
      alphaBookTotalValue: 0,
      alphaBookHoldingsCount: 0,
      alphaBookHHI: 0,
      effectiveHoldings: 0,
      gini: 0,
      sectorCount: 0,
      largestSector: 'N/A',
      largestSectorPct: 0,
      topHolding: { ticker: 'N/A', weightPct: 0 },
    }, ['topHolding']),
    performance: pickLive(liveAnalysis.performance, {
      betaBookTotalValue: 0,
      betaBookPortfolioPct: 0,
    }, ['betaBookTotalValue']),
    volatility: pickLive(liveAnalysis.volatility, {
      annualizedPct: 0,
      sharpe: 0,
      var95DailyPct: 0,
      cvar95DailyPct: 0,
      simulation_days_count: 0,
      simulationBestDayPct: 0,
      simulationWorstDayPct: 0,
    }, ['annualizedPct']),
    riskDecomposition: pickLive(liveAnalysis.riskDecomposition, {
      systematicRiskContributionPct: 0,
      idiosyncraticRiskScorePct: 0,
      idiosyncraticDetails: {
        weightedIndividualVolatility: 0,
        portfolioVolatility: 0,
        diversificationBenefit: 0,
        stockSpecificRisks: [],
      },
      marginalContributions: [],
      dynamicPositionLimits: [],
      correlationClusters: [],
    }, ['marginalContributions', 'dynamicPositionLimits']),
    strategies: pickLive(liveAnalysis.strategies, {
      recommended: 'N/A',
      expectedVol: { minimumVariance: 0, riskParity: 0, maximumDiversification: 0 },
      diversificationRatio: 0,
      turnoverCosts: {},
    }, ['expectedVol']),
    stressTesting: pickLive(liveAnalysis.stressTesting, {
      tail_risk_assessment: {
        tail_risk_level: 'UNKNOWN',
        one_day_var: 0,
        one_day_cvar: 0,
      },
      maxDrawdowns: { normal: 0, stress: 0, crisis: 0 },
      probabilities: { loss: 0, bigLoss: 0 },
      factorShock: 0,
      monteCarloAnalysis: {},
    }, ['tail_risk_assessment']),
    implementation: liveAnalysis.implementation || {},
  }), [liveAnalysis]);

  const totalPortfolioValue = analysis.riskMetrics.alphaBookTotalValue + analysis.performance.betaBookTotalValue;
  const hasHealthData =
    liveAnalysis?.riskMetrics?.effectiveHoldings !== undefined &&
    liveAnalysis?.volatility?.annualizedPct !== undefined &&
    liveAnalysis?.stressTesting?.tail_risk_assessment?.tail_risk_level !== undefined;

  const healthScore = hasHealthData
    ? calculateHealthScore({
        riskMetrics: { alpha_book_hhi_score: analysis.riskMetrics.alphaBookHHI, alpha_book_effective_holdings: analysis.riskMetrics.effectiveHoldings },
        volatility: { predictive_volatility_annualized_pct: analysis.volatility.annualizedPct / 100 },
        stressTesting: { tail_risk_assessment: { tail_risk_level: analysis.stressTesting.tail_risk_assessment.tail_risk_level } },
      })
    : null;

  const concentrationPenalty = analysis.riskMetrics.alphaBookHHI > 0.15 ? 15 : 10;
  const volatilityPenalty = analysis.volatility.annualizedPct > 20 ? 15 : analysis.volatility.annualizedPct > 15 ? 10 : 0;
  const tailPenalty = analysis.stressTesting.tail_risk_assessment.tail_risk_level === 'HIGH' ? 10 : 0;
  const diversificationPenalty = analysis.riskMetrics.effectiveHoldings < 10 ? 5 : 0;

  const positionLimits = analysis.riskDecomposition?.dynamicPositionLimits || [];
  const marginalContributions = analysis.riskDecomposition?.marginalContributions || [];
  const stockSpecificRisks = analysis.riskDecomposition?.idiosyncraticDetails?.stockSpecificRisks || [];

  const holdings = positionLimits.map((pos) => {
    const risk = marginalContributions.find((m) => m.ticker === pos.ticker);
    const performance = stockSpecificRisks.find((s) => s.ticker === pos.ticker);
    const action = pos.adjustmentNeeded
      ? pos.excessWeight > 0
        ? 'REDUCE'
        : 'INCREASE'
      : 'HOLD';

    return {
      ticker: pos.ticker,
      name: pos.ticker,
      weight: pos.currentWeight,
      recommendedMax: pos.recommendedMax,
      value: (pos.currentWeight / 100) * totalPortfolioValue,
      riskContribution: risk?.contribution,
      volatility: performance ? performance.individual_volatility * 100 : null,
      beta: null,
      sector: pos.sector,
      action,
    };
  });

  const riskContributionData = marginalContributions.map((item) => ({
    ticker: item.ticker,
    contribution: item.contribution,
  }));

  // Debug: Log what data is coming through for holdings
  useEffect(() => {
    console.log('[Dashboard] Raw polledResults:', polledResults);
    console.log('[Dashboard] optimization_risk_decomposition:', polledResults.optimization_risk_decomposition);
    console.log('[Dashboard] positionLimits:', positionLimits.length, positionLimits);
    console.log('[Dashboard] holdings:', holdings.length, holdings);
  }, [polledResults, positionLimits, holdings]);

  // Section navigation - these are page sections, NOT view tiers
  // Pills = WHERE on page (scroll spy navigation)
  // Dropdown = HOW MUCH detail (Simple/Analyst/Quant depth)
  const sectionLinks = [
    { id: 'overview-section', label: 'Overview', icon: Activity },
    { id: 'risk-section', label: 'Risk', icon: Shield },
    { id: 'holdings-section', label: 'Holdings', icon: PieChart },
    { id: 'diversification-section', label: 'Diversification', icon: GitBranch },
    { id: 'fundamentals-section', label: 'Fundamentals', icon: BarChart3 },
    { id: 'optimization-section', label: 'Optimization', icon: Target },
    { id: 'implementation-section', label: 'Implementation', icon: Cog },
  ];

  const correlationRows = (analysis.correlation?.tickers || []).map((ticker, i) => ({
    ticker,
    values: analysis.correlation.correlationMatrix[i] || [],
  }));

  const strategyLabels = {
    minimumVariance: 'Minimum Variance',
    riskParity: 'Risk Parity',
    maximumDiversification: 'Max Diversification',
  };

  const pieWeights = holdings.map((h) => ({ name: h.ticker, value: h.weight, risk: h.riskContribution || 0 }));
  const portfolioData = pieWeights;

  const currentVol = analysis.volatility.annualizedPct;
  const expectedMinVarVol = analysis.strategies.expectedVol.minimumVariance * 100;
  const healthLabel = healthScore === null
    ? 'Waiting for data'
    : healthScore >= 80
      ? 'Excellent'
      : healthScore >= 60
        ? 'Good'
        : healthScore >= 40
          ? 'Fair'
          : 'Poor';
  const riskLevelLabel = currentVol < 10 ? 'Low' : currentVol < 20 ? 'Moderate' : 'High';
  const riskEmoji = riskLevelLabel === 'Low' ? '🟢' : riskLevelLabel === 'Moderate' ? '🟡' : '🔴';
  const concentrationWeight = analysis.riskMetrics.topHolding.weightPct;
  const optimizationReductionPct = currentVol > 0
    ? (((currentVol - expectedMinVarVol) / currentVol) * 100).toFixed(0)
    : '0';
  const portfolioBeta = analysis.correlation.portfolioMarketBeta;
  const explainedRiskPct = analysis.correlation.explainedRiskPct;
  const unexplainedRiskPct = analysis.correlation.unexplainedRiskPct;
  const highestBeta = analysis.correlation.highestBeta;
  const lowestBeta = analysis.correlation.lowestBeta;
  const topRisk = marginalContributions[0] || { ticker: '—', contribution: 0 };
  const positionsOverLimit = positionLimits.filter((p) => p.adjustmentNeeded);
  const simulationDays = analysis.volatility.simulation_days_count;

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!analysisRunId) {
      setError('No analysis selected. Go to the selector to choose a run.');
    } else {
      setError(null);
    }
  }, [isAuthenticated, analysisRunId]);

  useEffect(() => {
    if (pollingError) {
      setError('Live analysis is unavailable right now.');
    }
  }, [pollingError]);

  useEffect(() => {
    localStorage.setItem('viewTier', viewTier);
  }, [viewTier]);

  useEffect(() => {
    if (isAuthenticated && !analysisRunId && !selectorOpenedRef.current) {
      setSelectorOpen(true);
      selectorOpenedRef.current = true;
    }
  }, [analysisRunId, isAuthenticated]);

  const handleRunChange = (runId) => {
    setAnalysisRunId(runId);
    setError(null);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleClearError = () => setError(null);

  // Colors for consistent theming
  const COLORS = {
    primary: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  };

  const [activeSection, setActiveSection] = useState(sectionLinks[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 140; // matches scroll-mt-32 (128px) + some buffer
      let closestId = activeSection;
      let closestDistance = Infinity;

      sectionLinks.forEach((link) => {
        const el = document.getElementById(link.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - offset);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = link.id;
        }
      });

      if (closestId !== activeSection) {
        setActiveSection(closestId);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, sectionLinks]);

  // Chart colors
  const PIE_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1', '#8B5CF6'];

  return (
    <div className="space-y-8 pb-12">
      {(!analysisRunId || error) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">No analysis selected</p>
              <p className="text-sm">
                {error || 'Tap change run to pick a portfolio/version or start a new analysis.'}
              </p>
            </div>
            <button
              onClick={() => setSelectorOpen(true)}
              className="ml-auto text-sm font-semibold text-primary-700 hover:text-primary-800 underline"
            >
              Change run
            </button>
          </div>
        </div>
      )}

      {/* Backend Status - Shows "waking up" for Heroku cold starts */}
      {(polling && connectionStatus !== 'connected') && (
        <BackendStatus
          isLoading={polling}
          error={pollingError}
          loadingStartTime={loadingStartTime}
          onRetry={handleRetry}
        />
      )}

      {/* Normal progress indicator once connected */}
      {polling && connectionStatus === 'connected' && (
        <div className="card-glass-blue px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ios-blue animate-pulse" />
              <span className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>
                Analyzing portfolio
              </span>
            </div>
            <div className="flex-1 min-w-[120px] max-w-[200px]">
              <div className="progress-ios">
                <div
                  className="progress-ios-fill"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>
            </div>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: 'rgba(0, 122, 255, 0.12)', color: '#007AFF' }}
            >
              {progress || 0}%
            </span>
            {pending?.size > 0 && (
              <span className="text-xs" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
                {pending.size} remaining
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error state when not loading */}
      {pollingError && !polling && (
        <BackendStatus
          isLoading={false}
          error={pollingError}
          onRetry={handleRetry}
        />
      )}

      {/* Hero Card - Portfolio Overview */}
      {polling && !healthScore ? (
        <SkeletonHeroCard />
      ) : (
        <HeroCard
          portfolioValue={totalPortfolioValue}
          dailyChange={totalPortfolioValue * 0.024} // Mock daily change - would come from real data
          dailyChangePercent={2.4} // Mock - would come from real data
          healthScore={healthScore}
          riskLevel={riskLevelLabel}
          volatility={currentVol}
          onOptimize={() => {
            setShowOptimizationStrategies(true);
            document.getElementById('optimization-section')?.scrollIntoView({ behavior: 'smooth' });
            toast.info('Optimization', 'Showing optimization strategies');
          }}
          onExport={() => toast.success('Export Started', 'Your report is being generated')}
          onCompare={() => {
            document.getElementById('optimization-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          isLoading={polling && !healthScore}
        />
      )}

      {/* In-page anchor bar (single sticky element for this page) */}
      <div className="md:sticky md:top-16 z-30 -mx-4 px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveSection(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border whitespace-nowrap transition-all ${
                  activeSection === link.id
                    ? 'bg-primary-600/90 text-white border-primary-700 shadow-sm'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:text-primary-700 shadow-sm'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Command Palette trigger */}
            <button
              onClick={commandPalette.open}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:text-primary-700 shadow-sm"
              title="Open command palette (⌘K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-xs">⌘K</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:text-primary-700 shadow-sm"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setSelectorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold transition-all bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:text-primary-700 shadow-sm"
              title="Change analysis run"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Change run</span>
            </button>

            {/* View Tier Selector */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold transition-all ${
                  viewTier === 'quant'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                    : viewTier === 'analyst'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-sm'
                }`}
                title={`Current view: ${VIEW_TIERS[viewTier].label}`}
              >
                {viewTier === 'quant' && <Layers className="w-4 h-4" />}
                {viewTier === 'analyst' && <TrendingUp className="w-4 h-4" />}
                {viewTier === 'simple' && <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{VIEW_TIERS[viewTier].label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {Object.entries(VIEW_TIERS).map(([key, tier]) => (
                  <button
                    key={key}
                    onClick={() => setViewTier(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left first:rounded-t-xl last:rounded-b-xl transition-colors ${
                      viewTier === key
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <tier.icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{tier.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{tier.description}</div>
                    </div>
                    {viewTier === key && (
                      <span className="ml-auto text-primary-600 dark:text-primary-400 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Learn button */}
            <button
              onClick={learnMore.openGlossary}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-ios-blue hover:text-ios-blue shadow-sm"
              title="Learn about investing terms"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-xs">Learn</span>
            </button>

            {/* Help button */}
            <button
              onClick={onboarding.startTour}
              className="p-2 rounded-full border transition-all bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:text-primary-700 shadow-sm"
              title="Start guided tour"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Section - Health Score & Key Metrics */}
      <div id="overview-section" className="scroll-mt-32">
        <HealthSection
          analysis={analysis}
          portfolioBeta={portfolioBeta}
          explainedRiskPct={explainedRiskPct}
          unexplainedRiskPct={unexplainedRiskPct}
          highestBeta={highestBeta}
          lowestBeta={lowestBeta}
          healthScore={healthScore}
          healthLabel={healthLabel}
          concentrationPenalty={concentrationPenalty}
          volatilityPenalty={volatilityPenalty}
          tailPenalty={tailPenalty}
          diversificationPenalty={diversificationPenalty}
          riskLevelLabel={riskLevelLabel}
          riskEmoji={riskEmoji}
          currentVol={currentVol}
          concentrationWeight={concentrationWeight}
          topRisk={topRisk}
          showAdvanced={showAdvanced}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
          isExpanded={expandedSections['health-score']}
          onToggle={() => toggleSection('health-score')}
          viewTier={viewTier}
        />
      </div>

      {/* Risk Section - VaR, Volatility, Stress Testing */}
      <div id="risk-section" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Risk Analysis</h2>
          {viewTier !== 'simple' && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              viewTier === 'quant'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {VIEW_TIERS[viewTier].label} View
            </span>
          )}
        </div>

        {/* Risk Overview Card - Volatility, VaR, CVaR, Monte Carlo */}
        <RiskOverviewCard
          volatility={analysis.volatility}
          stressTesting={analysis.stressTesting}
          riskDecomposition={analysis.riskDecomposition}
          viewTier={viewTier}
        />

        {/* Insights Section - Key Insights & Recommendations */}
        <InsightsSection
          analysis={analysis}
          portfolioBeta={portfolioBeta}
          concentrationWeight={concentrationWeight}
          topRisk={topRisk}
          optimizationReductionPct={optimizationReductionPct}
          currentVol={currentVol}
          expectedMinVarVol={expectedMinVarVol}
          showOptimizationStrategies={showOptimizationStrategies}
          setShowOptimizationStrategies={setShowOptimizationStrategies}
          strategyLabels={strategyLabels}
          explainedRiskPct={explainedRiskPct}
          unexplainedRiskPct={unexplainedRiskPct}
          correlationRows={correlationRows}
          showAdvanced={showAdvanced}
          isExpanded={expandedSections['key-insights']}
          onToggle={() => toggleSection('key-insights')}
          viewTier={viewTier}
        />
      </div>

      {/* Holdings Section - Position Data & Allocation */}
      <div id="holdings-section" className="scroll-mt-32">
        <HoldingsSection
          analysis={analysis}
          portfolioData={portfolioData}
          pieColors={PIE_COLORS}
          holdings={holdings}
          riskContributionData={riskContributionData}
          showAdvanced={showAdvanced}
          positionsOverLimit={positionsOverLimit}
          concentrationWeight={concentrationWeight}
          topRisk={topRisk}
          isExpanded={expandedSections['holdings']}
          onToggle={() => toggleSection('holdings')}
          isLoading={polling}
          viewTier={viewTier}
        />
      </div>

      {/* Diversification Section - Correlation Clusters & Balance */}
      <div id="diversification-section" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="w-6 h-6 text-cyan-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Diversification</h2>
          {viewTier !== 'simple' && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              viewTier === 'quant'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {VIEW_TIERS[viewTier].label} View
            </span>
          )}
        </div>

        {/* Correlation Clusters - Group visualization */}
        <CorrelationClustersCard
          riskDecomposition={analysis.riskDecomposition}
          viewTier={viewTier}
        />
      </div>

      {/* Fundamentals Section - P/E, Dividends, Beta */}
      <div id="fundamentals-section" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fundamentals</h2>
          {viewTier !== 'simple' && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              viewTier === 'quant'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {VIEW_TIERS[viewTier].label} View
            </span>
          )}
        </div>

        <FundamentalsCard
          riskDecomposition={analysis.riskDecomposition}
          viewTier={viewTier}
        />
      </div>

      {/* Optimization Section - Strategy Comparison, Goals, What-If */}
      <div id="optimization-section" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Optimization</h2>
          {viewTier !== 'simple' && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              viewTier === 'quant'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {VIEW_TIERS[viewTier].label} View
            </span>
          )}
        </div>

        {/* Strategy Comparison - Full optimization strategies */}
        {(viewTier === 'analyst' || viewTier === 'quant') && (
          <StrategyComparisonCard
            strategies={analysis.strategies}
            currentVolatility={currentVol}
            viewTier={viewTier}
          />
        )}

        {/* Goals Section */}
        <GoalsSection
          currentVolatility={currentVol}
          currentHealthScore={healthScore || 0}
          currentHoldings={holdings.length}
          currentBeta={portfolioBeta}
        />

        {/* What-If Scenario Simulator */}
        <WhatIfSimulator
          holdings={holdings}
          currentVolatility={currentVol}
          currentBeta={portfolioBeta}
          currentConcentration={analysis.riskMetrics.alphaBookHHI}
        />
      </div>

      {/* Implementation Section - Liquidity, Costs, Tax, Execution */}
      <div id="implementation-section" className="scroll-mt-32">
        {(viewTier === 'analyst' || viewTier === 'quant') ? (
          <ImplementationSection
            implementation={analysis.implementation}
            showAdvanced={showAdvanced}
            viewTier={viewTier}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cog className="w-6 h-6 text-gray-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Implementation</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Switch to <span className="font-semibold text-blue-600 dark:text-blue-400">Analyst</span> or <span className="font-semibold text-purple-600 dark:text-purple-400">Quant</span> view to see implementation details including liquidity analysis, transaction costs, and execution recommendations.
            </p>
          </div>
        )}
      </div>

      {/* Onboarding Help - Always Visible */}
      <div className="card bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border-2 border-primary-300 dark:border-gray-700 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              How to Navigate Your Analysis
            </h3>
            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${viewTier === 'simple' ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400' : 'bg-white/70 dark:bg-gray-700/50'}`}>
                <span className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center font-bold">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Simple View</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Quick health check with key metrics. Everything you need at a glance—no jargon.</div>
                </div>
                {viewTier === 'simple' && <span className="ml-auto text-green-600 font-bold text-sm">Active</span>}
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${viewTier === 'analyst' ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-400' : 'bg-white/70 dark:bg-gray-700/50'}`}>
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Analyst View</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Understand the "why" behind each recommendation. See optimization strategies and implementation details.</div>
                </div>
                {viewTier === 'analyst' && <span className="ml-auto text-blue-600 font-bold text-sm">Active</span>}
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${viewTier === 'quant' ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-400' : 'bg-white/70 dark:bg-gray-700/50'}`}>
                <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Quant View</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Full data transparency. See every calculation, raw numbers, formulas, and statistical details.</div>
                </div>
                {viewTier === 'quant' && <span className="ml-auto text-purple-600 font-bold text-sm">Active</span>}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-gray-700 dark:to-gray-700 rounded-lg border-2 border-primary-300 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {viewTier === 'quant' ? (
                    <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  ) : viewTier === 'analyst' ? (
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">
                    Currently in {VIEW_TIERS[viewTier].label} View
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {viewTier === 'simple' && 'Use the dropdown in the toolbar above to switch to Analyst or Quant view for more details.'}
                    {viewTier === 'analyst' && 'You\'re seeing additional strategy comparisons and implementation details. Switch to Quant for full statistics.'}
                    {viewTier === 'quant' && 'You\'re seeing all available data including Monte Carlo distributions, correlation matrices, and raw calculations.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SessionSelectorDialog
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelectRun={handleRunChange}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
      />

      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={onboarding.isOpen}
        onClose={onboarding.endTour}
        onComplete={() => {
          toast.success('Welcome!', 'You\'re all set to explore your portfolio');
        }}
      />

      {/* Learn More Modal */}
      <LearnMoreModal
        isOpen={learnMore.isOpen}
        onClose={learnMore.close}
        initialTerm={learnMore.initialTerm}
        initialCategory={learnMore.initialCategory}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onStartTour={onboarding.startTour} />

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer md:hidden" />
    </div>
  );
};

export default Dashboard;
