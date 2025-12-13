import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AlertCircle, TrendingUp, Activity, Layers, Eye, Moon, Sun, BookOpen, ChevronDown, Shield, PieChart, GitBranch, BarChart3, Target, Cog } from 'lucide-react';
import client from '@/services/client';
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
import { useOnboarding } from '@/components/common/OnboardingWizard';
import MobileBottomNav from '@/components/common/MobileBottomNav';
import LearnMoreModal, { useLearnMore } from '@/components/common/LearnMoreModal';
import { SkeletonHeroCard } from '@/components/common/Skeleton';
import AnalysisProgressCard from '@/components/dashboard/AnalysisProgressCard';
import { calculateHealthScore } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import useAnalysisPolling from '@/hooks/useAnalysisPolling';
import SessionSelectorDialog from '@/components/dashboard/SessionSelectorDialog';
import NewAnalysisModal from '@/components/dashboard/NewAnalysisModal';

// View tier definitions
const VIEW_TIERS = {
  simple: { label: 'Simple', description: 'Key metrics at a glance', icon: Eye },
  analyst: { label: 'Analyst', description: 'Deeper insights & context', icon: TrendingUp },
  quant: { label: 'Quant', description: 'Full data transparency', icon: Layers },
};

// Reusable view tier badge component
const ViewTierBadge = ({ viewTier }) => {
  if (viewTier === 'simple') return null;
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
      viewTier === 'quant'
        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    }`}>
      {VIEW_TIERS[viewTier].label} View
    </span>
  );
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
  const [portfolioName, setPortfolioName] = useState(localStorage.getItem('portfolioName') || '');
  const [versionName, setVersionName] = useState(localStorage.getItem('versionName') || '');
  const [showSessionSelector, setShowSessionSelector] = useState(false);
  const [newAnalysisOpen, setNewAnalysisOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'health-score': true,
    'key-insights': true,
    'risk-breakdown': true,
    'holdings': true
  });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const commandPalette = useCommandPalette();
  const onboarding = useOnboarding();
  const learnMore = useLearnMore();

  const {
    results: polledResults,
    loading: polling,
    error: pollingError,
    pending,
    connectionStatus,
    loadingStartTime,
  } = useAnalysisPolling(analysisRunId);

  // Server warm-up state - shows "waking up" on initial page load
  const [serverWarmup, setServerWarmup] = useState({
    isWarming: true,
    startTime: Date.now(),
    error: null,
  });
  const warmupAttempted = useRef(false);

  // Pre-warm the Heroku server on Dashboard mount
  useEffect(() => {
    if (warmupAttempted.current) return;
    warmupAttempted.current = true;

    const warmupServer = async () => {
      try {
        // Simple health check to wake up the server
        await client.get('/health');
        setServerWarmup({ isWarming: false, startTime: null, error: null });
      } catch (err) {
        // Even on error, stop showing warmup after timeout
        // The actual API calls will handle errors properly
        setServerWarmup({ isWarming: false, startTime: null, error: null });
      }
    };

    warmupServer();

    // Fallback: Stop showing warmup after 20 seconds regardless
    const timeout = setTimeout(() => {
      setServerWarmup((prev) => prev.isWarming ? { isWarming: false, startTime: null, error: null } : prev);
    }, 20000);

    return () => clearTimeout(timeout);
  }, []);

  // Auto-start onboarding tour for new users (only on Dashboard, not login page)
  const onboardingTriggered = useRef(false);
  useEffect(() => {
    if (onboardingTriggered.current) return;
    if (isAuthenticated && !serverWarmup.isWarming) {
      onboardingTriggered.current = true;
      // Trigger onboarding for new users after server is ready
      onboarding.autoStartForNewUser();
      // Mark user as returning after their first dashboard visit
      onboarding.markUserAsReturning();
    }
  }, [isAuthenticated, serverWarmup.isWarming, onboarding]);

  // Track which sections are still loading based on pending subtools
  const sectionLoadingStates = useMemo(() => ({
    // Overview needs: math_correlation, math_risk_metrics, math_volatility, optimization_stress_testing
    overview: pending.has('math_correlation') || pending.has('math_risk_metrics') ||
              pending.has('math_volatility') || pending.has('optimization_stress_testing'),
    // Risk needs: math_volatility, optimization_stress_testing, optimization_risk_decomposition
    risk: pending.has('math_volatility') || pending.has('optimization_stress_testing') ||
          pending.has('optimization_risk_decomposition'),
    // Holdings needs: optimization_risk_decomposition
    holdings: pending.has('optimization_risk_decomposition'),
    // Diversification needs: optimization_risk_decomposition
    diversification: pending.has('optimization_risk_decomposition'),
    // Optimization needs: optimization_strategy_generation
    optimization: pending.has('optimization_strategy_generation'),
    // Implementation needs: optimization_implementation
    implementation: pending.has('optimization_implementation'),
  }), [pending]);

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

  // Normalize backend field names to what Dashboard components expect
  const normalizeVolatility = (v) => {
    if (!v) return null;
    return {
      ...v,
      annualizedPct: v.predictiveVolatilityAnnualizedPct ?? v.annualizedPct ?? 0,
      sharpe: v.predictiveSharpeRatio ?? v.sharpe ?? 0,
      var95DailyPct: v.historicalVar95DailyPct ?? v.var95DailyPct ?? 0,
      cvar95DailyPct: v.historicalCvar95DailyPct ?? v.cvar95DailyPct ?? 0,
      // Tier 1: Drawdown metrics
      maximumDrawdownPct: v.maximumDrawdownPct ?? null,
      maximumDrawdownDurationDays: v.maximumDrawdownDurationDays ?? null,
      currentDrawdownPct: v.currentDrawdownPct ?? null,
      recoveryTimeEstimateDays: v.recoveryTimeEstimateDays ?? null,
      drawdownAnalysisStatus: v.drawdownAnalysisStatus ?? 'not_available',
      // Tier 1: Rolling Sharpe ratios
      rollingSharpe30d: v.rollingSharpe30d ?? null,
      rollingSharpe60d: v.rollingSharpe60d ?? null,
      rollingSharpe90d: v.rollingSharpe90d ?? null,
      rollingSharpeStatus: v.rollingSharpeStatus ?? 'not_available',
      // TIER 2: Goal Projection (Feature #6)
      goalProjections: v.goalProjections ?? null,
      monteCarloSimulations: v.monteCarloSimulations ?? 0,
      projectionYears: v.projectionYears ?? [],
      historicalAnnualReturnPct: v.historicalAnnualReturnPct ?? null,
      historicalAnnualVolatilityPct: v.historicalAnnualVolatilityPct ?? null,
      goalProjectionStatus: v.goalProjectionStatus ?? 'not_available',
    };
  };

  const normalizeRiskMetrics = (rm) => {
    if (!rm) return null;
    return {
      ...rm,
      alphaBookHHI: rm.alphaBookHhiScore ?? rm.alphaBookHHI ?? 0,
      effectiveHoldings: rm.alphaBookEffectiveHoldings ?? rm.effectiveHoldings ?? 0,
      gini: rm.alphaBookGiniCoefficient ?? rm.gini ?? 0,
      sectorCount: rm.alphaBookSectorCount ?? rm.sectorCount ?? 0,
      largestSector: rm.alphaBookLargestSector ?? rm.largestSector ?? 'N/A',
      largestSectorPct: rm.alphaBookLargestSectorPct ?? rm.largestSectorPct ?? 0,
      topHolding: {
        ticker: rm.alphaBookTopHoldingTicker ?? rm.topHolding?.ticker ?? 'N/A',
        weightPct: rm.alphaBookTopHoldingPct ?? rm.topHolding?.weightPct ?? 0,
      },
      // Tier 1: Portfolio fundamentals
      weightedPeRatio: rm.weightedPeRatio ?? null,
      weightedDividendYieldPct: rm.weightedDividendYieldPct ?? null,
      weightedBeta: rm.weightedBeta ?? null,
      annualDividendIncomeEstimate: rm.annualDividendIncomeEstimate ?? null,
      // Tier 1: Market cap breakdown
      marketCapMegaPct: rm.marketCapMegaPct ?? 0,
      marketCapLargePct: rm.marketCapLargePct ?? 0,
      marketCapMidPct: rm.marketCapMidPct ?? 0,
      marketCapSmallPct: rm.marketCapSmallPct ?? 0,
      marketCapMicroPct: rm.marketCapMicroPct ?? 0,
      fundamentalsCoveragePct: rm.fundamentalsCoveragePct ?? 0,
      fundamentalsStatus: rm.fundamentalsStatus ?? 'not_available',
      // TIER 2: Tax-Loss Harvesting (Feature #5)
      taxLossHarvestingOpportunities: rm.taxLossHarvestingOpportunities ?? [],
      harvestingCandidates: rm.harvestingCandidates ?? [],
      totalEstimatedLosses: rm.totalEstimatedLosses ?? 0,
      totalEstimatedGains: rm.totalEstimatedGains ?? 0,
      netUnrealizedGainLoss: rm.netUnrealizedGainLoss ?? 0,
      estimatedTaxSavingsAt20pct: rm.estimatedTaxSavingsAt20pct ?? 0,
      positionsWithLosses: rm.positionsWithLosses ?? 0,
      positionsWithGains: rm.positionsWithGains ?? 0,
      taxLossHarvestingStatus: rm.taxLossHarvestingStatus ?? 'not_available',
    };
  };

  const normalizeCorrelation = (c) => {
    if (!c) return null;
    return {
      ...c,
      highestBeta: {
        ticker: c.highestBetaTicker ?? c.highestBeta?.ticker ?? 'N/A',
        value: c.highestBetaValue ?? c.highestBeta?.value ?? 0,
      },
      lowestBeta: {
        ticker: c.lowestBetaTicker ?? c.lowestBeta?.ticker ?? 'N/A',
        value: c.lowestBetaValue ?? c.lowestBeta?.value ?? 0,
      },
      // TIER 2: Multi-Factor Exposure (Feature #7)
      sizeFactorExposure: c.sizeFactorExposure ?? 0,
      valueFactorExposure: c.valueFactorExposure ?? 0,
      momentumFactorExposure: c.momentumFactorExposure ?? 0,
      factorTilts: c.factorTilts ?? {},
      sizeInterpretation: c.sizeInterpretation ?? null,
      valueInterpretation: c.valueInterpretation ?? null,
      momentumInterpretation: c.momentumInterpretation ?? null,
      multiFactorStatus: c.multiFactorStatus ?? 'not_available',
    };
  };

  const normalizeStressTesting = (st) => {
    if (!st) return null;
    const tailRisk = st.tailRiskAssessment ?? st.tail_risk_assessment ?? {};
    return {
      ...st,
      tail_risk_assessment: {
        tail_risk_level: tailRisk.tailRiskLevel ?? tailRisk.tail_risk_level ?? 'UNKNOWN',
        one_day_var: tailRisk.valuAtRiskProjections?.oneDayVar ?? tailRisk.one_day_var ?? 0,
        one_day_cvar: tailRisk.conditionalVarAnalysis?.oneDayCvar ?? tailRisk.one_day_cvar ?? 0,
      },
    };
  };

  const normalizeStrategies = (s) => {
    if (!s) return null;
    const strategies = s.availableStrategies || {};
    return {
      ...s,
      recommended: s.recommendedStrategy?.recommended ?? s.recommended ?? 'N/A',
      expectedVol: {
        minimumVariance: strategies.minimumVariance?.expectedPortfolioVolatility ?? 0,
        riskParity: strategies.riskParity?.expectedPortfolioVolatility ?? 0,
        maximumDiversification: strategies.maximumDiversification?.diversificationRatio ?? 0,
      },
    };
  };

  const normalizeRiskDecomposition = (rd) => {
    if (!rd) return null;
    const systematic = rd.systematicRiskAnalysis || {};
    const idiosyncratic = rd.idiosyncraticRiskAnalysis || {};
    return {
      ...rd,
      // Map API field names to what Dashboard expects
      systematicRiskContributionPct: systematic.systematicRiskContributionPct ?? rd.systematicRiskContributionPct ?? 0,
      idiosyncraticRiskScorePct: idiosyncratic.idiosyncraticRiskScorePct ?? rd.idiosyncraticRiskScorePct ?? 0,
      idiosyncraticDetails: idiosyncratic,
      // Normalize marginal contributions field name
      marginalContributions: rd.marginalRiskContributions ?? rd.marginalContributions ?? [],
      // Keep dynamicPositionLimits as-is (it's an object with positionLimits array inside)
      dynamicPositionLimits: rd.dynamicPositionLimits ?? {},
    };
  };

  // TIER 2: Normalize performance (math_performance) for Cost Analysis (Feature #8)
  const normalizePerformance = (p) => {
    if (!p) return null;
    return {
      ...p,
      betaBookTotalValue: p.betaBookTotalValue ?? 0,
      betaBookPortfolioPct: p.betaBookPortfolioPct ?? 0,
      betaBookHoldingsCount: p.betaBookHoldingsCount ?? 0,
      betaBookWeightedExpenseRatioPct: p.betaBookWeightedExpenseRatioPct ?? 0,
      // TIER 2: Cost Analysis fields
      annualCostDragDollars: p.annualCostDragDollars ?? 0,
      costPerEtf: p.costPerEtf ?? [],
      tenYearProjectedCost: p.tenYearProjectedCost ?? 0,
      costAsPctOfExpectedReturns: p.costAsPctOfExpectedReturns ?? 0,
      highestCostEtfTicker: p.highestCostEtfTicker ?? null,
      highestCostEtfAnnualDollars: p.highestCostEtfAnnualDollars ?? 0,
      costAnalysisStatus: p.costAnalysisStatus ?? 'not_available',
    };
  };

  const liveAnalysis = useMemo(() => ({
    correlation: normalizeCorrelation(polledResults.math_correlation),
    riskMetrics: normalizeRiskMetrics(polledResults.math_risk_metrics),
    performance: normalizePerformance(polledResults.math_performance),
    volatility: normalizeVolatility(polledResults.math_volatility),
    riskDecomposition: normalizeRiskDecomposition(polledResults.optimization_risk_decomposition),
    strategies: normalizeStrategies(polledResults.optimization_strategy_generation),
    stressTesting: normalizeStressTesting(polledResults.optimization_stress_testing),
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
      simulationDaysCount: 0,
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
      dynamicPositionLimits: { positionLimits: [] },
      correlationClusters: [],
    }, ['marginalContributions']),
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

  const totalPortfolioValue = (analysis.riskMetrics?.alphaBookTotalValue ?? 0) + (analysis.performance?.betaBookTotalValue ?? 0);
  const hasHealthData =
    liveAnalysis?.riskMetrics?.effectiveHoldings !== undefined &&
    liveAnalysis?.volatility?.annualizedPct !== undefined &&
    liveAnalysis?.stressTesting?.tail_risk_assessment?.tail_risk_level !== undefined;

  const healthScore = hasHealthData
    ? calculateHealthScore({
        riskMetrics: { alpha_book_hhi_score: analysis.riskMetrics?.alphaBookHHI ?? 0, alpha_book_effective_holdings: analysis.riskMetrics?.effectiveHoldings ?? 0 },
        volatility: { predictive_volatility_annualized_pct: (analysis.volatility?.annualizedPct ?? 0) / 100 },
        stressTesting: { tail_risk_assessment: { tail_risk_level: analysis.stressTesting?.tail_risk_assessment?.tail_risk_level ?? 'UNKNOWN' } },
      })
    : null;

  const concentrationPenalty = (analysis.riskMetrics?.alphaBookHHI ?? 0) > 0.15 ? 15 : 0;
  const volatilityPenalty = (analysis.volatility?.annualizedPct ?? 0) > 20 ? 15 : (analysis.volatility?.annualizedPct ?? 0) > 15 ? 10 : 0;
  const tailPenalty = analysis.stressTesting?.tail_risk_assessment?.tail_risk_level === 'HIGH' ? 10 : 0;
  const diversificationPenalty = (analysis.riskMetrics?.effectiveHoldings ?? 0) < 10 ? 5 : 0;

  // Backend returns nested structure: dynamicPositionLimits.positionLimits
  const positionLimits = analysis.riskDecomposition?.dynamicPositionLimits?.positionLimits || [];
  // Backend returns nested: marginalRiskContributions (not marginalContributions)
  const marginalContributions = analysis.riskDecomposition?.marginalRiskContributions || [];
  // Backend returns nested: idiosyncraticRiskAnalysis.stockSpecificRisks
  const stockSpecificRisks = analysis.riskDecomposition?.idiosyncraticRiskAnalysis?.stockSpecificRisks || [];

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
      recommendedMax: pos.recommendedMaxWeight, // Backend uses recommendedMaxWeight
      value: (pos.currentWeight / 100) * totalPortfolioValue,
      riskContribution: risk?.marginalRiskContribution || risk?.contribution, // Backend uses marginalRiskContribution
      volatility: performance ? performance.individualVolatility * 100 : null, // Backend uses individualVolatility (camelCase)
      beta: null,
      sector: pos.sector,
      action,
    };
  });

  const riskContributionData = marginalContributions.map((item) => ({
    ticker: item.ticker,
    contribution: item.marginalRiskContribution || item.contribution,
  }));

  // Section navigation - these are page sections, NOT view tiers
  // Pills = WHERE on page (scroll spy navigation)
  // Dropdown = HOW MUCH detail (Simple/Analyst/Quant depth)
  const sectionLinks = useMemo(() => [
    { id: 'overview-section', label: 'Overview', icon: Activity },
    { id: 'risk-section', label: 'Risk', icon: Shield },
    { id: 'holdings-section', label: 'Holdings', icon: PieChart },
    { id: 'diversification-section', label: 'Diversification', icon: GitBranch },
    { id: 'fundamentals-section', label: 'Fundamentals', icon: BarChart3 },
    { id: 'optimization-section', label: 'Optimization', icon: Target },
    { id: 'implementation-section', label: 'Implementation', icon: Cog },
  ], []);

  const correlationRows = (analysis.correlation?.tickers || []).map((ticker, i) => ({
    ticker,
    values: analysis.correlation?.correlationMatrix?.[i] || [],
  }));

  const strategyLabels = {
    minimumVariance: 'Minimum Variance',
    riskParity: 'Risk Parity',
    maximumDiversification: 'Max Diversification',
  };

  const pieWeights = holdings.map((h) => ({ name: h.ticker, value: h.weight, risk: h.riskContribution || 0 }));
  const portfolioData = pieWeights;

  const currentVol = analysis.volatility?.annualizedPct ?? 0;
  const expectedMinVarVol = (analysis.strategies?.expectedVol?.minimumVariance ?? 0) * 100;
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
  const concentrationWeight = analysis.riskMetrics?.topHolding?.weightPct ?? 0;
  const optimizationReductionPct = currentVol > 0
    ? (((currentVol - expectedMinVarVol) / currentVol) * 100).toFixed(0)
    : '0';
  const portfolioBeta = analysis.correlation?.portfolioMarketBeta ?? 0;
  const explainedRiskPct = analysis.correlation?.explainedRiskPct ?? 0;
  const unexplainedRiskPct = analysis.correlation?.unexplainedRiskPct ?? 0;
  const highestBeta = analysis.correlation?.highestBeta ?? { ticker: 'N/A', value: 0 };
  const lowestBeta = analysis.correlation?.lowestBeta ?? { ticker: 'N/A', value: 0 };
  const topRisk = marginalContributions[0] || { ticker: '—', marginalRiskContribution: 0, contribution: 0 };
  const positionsOverLimit = positionLimits.filter((p) => p.adjustmentNeeded);

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

  const handleRunChange = (runId, portfolioData = {}) => {
    localStorage.setItem('analysisRunId', runId);
    setAnalysisRunId(runId);
    setError(null);
    // Store portfolio metadata if provided
    if (portfolioData.portfolioName) {
      localStorage.setItem('portfolioName', portfolioData.portfolioName);
      setPortfolioName(portfolioData.portfolioName);
    }
    if (portfolioData.versionName) {
      localStorage.setItem('versionName', portfolioData.versionName);
      setVersionName(portfolioData.versionName);
    }
    // Close the modal if open
    setShowSessionSelector(false);
  };

  const goToPortfolioSelector = () => {
    localStorage.removeItem('analysisRunId');
    setAnalysisRunId('');
    setError(null);
  };

  const openSessionSelectorModal = () => {
    setShowSessionSelector(true);
  };

  const handleAnalysisStarted = (runId, portfolioData = {}) => {
    localStorage.setItem('analysisRunId', runId);
    setAnalysisRunId(runId);
    // Store portfolio metadata if provided
    if (portfolioData.portfolioName) {
      localStorage.setItem('portfolioName', portfolioData.portfolioName);
      setPortfolioName(portfolioData.portfolioName);
    }
    if (portfolioData.versionName) {
      localStorage.setItem('versionName', portfolioData.versionName);
      setVersionName(portfolioData.versionName);
    }
    setNewAnalysisOpen(false);
    setShowSessionSelector(false);
    toast.success('Analysis Started', 'Your portfolio analysis is now running.');
  };

  const handleOpenNewAnalysis = () => {
    setNewAnalysisOpen(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
  const PIE_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6', '#F97316', '#8B5CF6', '#06B6D4', '#D946EF'];

  // Show unified welcome/portfolio selector when no analysis is selected
  if (!analysisRunId && !polling) {
    return (
      <>
        <SessionSelectorDialog
          embedded={true}
          onSelectRun={handleRunChange}
          onStartNewAnalysis={handleOpenNewAnalysis}
          userName={user?.firstName}
        />
        <NewAnalysisModal
          isOpen={newAnalysisOpen}
          onClose={() => setNewAnalysisOpen(false)}
          onAnalysisStarted={handleAnalysisStarted}
        />
      </>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8 pb-4 sm:pb-12">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Analysis Error</p>
              <p className="text-sm">
                {error}
              </p>
            </div>
            <button
              onClick={goToPortfolioSelector}
              className="ml-auto text-sm font-semibold text-primary-700 hover:text-primary-800 underline"
            >
              Change run
            </button>
          </div>
        </div>
      )}

      {/* Backend Status - Shows "waking up" for Heroku cold starts */}
      {/* Show during initial server warmup OR during analysis polling before connected */}
      {(serverWarmup.isWarming || (polling && connectionStatus !== 'connected')) && (
        <BackendStatus
          isLoading={serverWarmup.isWarming || polling}
          error={pollingError}
          loadingStartTime={serverWarmup.isWarming ? serverWarmup.startTime : loadingStartTime}
          onRetry={handleRetry}
        />
      )}

      {/* Detailed progress card showing each subtool status */}
      {polling && connectionStatus === 'connected' && pending?.size > 0 && (
        <AnalysisProgressCard
          pending={pending}
          results={polledResults}
          isConnected={connectionStatus === 'connected'}
        />
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
          dailyChange={analysis.performance?.dailyChangeDollars ?? 0}
          dailyChangePercent={analysis.performance?.dailyChangePct ?? 0}
          healthScore={healthScore}
          riskLevel={riskLevelLabel}
          volatility={currentVol}
          holdingsCount={holdings.length}
          annualDividendIncome={analysis.riskMetrics?.annualDividendIncomeEstimate ?? null}
          portfolioName={portfolioName}
          versionName={versionName}
          onSwitchPortfolio={openSessionSelectorModal}
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
      <div className="md:sticky md:top-20 z-40 -mx-4 px-4 py-1.5 sm:py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
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
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-200 hover:text-primary-700 shadow-sm"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* View Tier Selector */}
            <div className="relative group z-50">
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
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
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
          viewTier={viewTier}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
          isExpanded={expandedSections['health-score']}
          onToggle={() => toggleSection('health-score')}
        />
      </div>

      {/* Risk Section - VaR, Volatility, Stress Testing */}
      <div id="risk-section" className="scroll-mt-32 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Risk Analysis</h2>
          <ViewTierBadge viewTier={viewTier} />
        </div>

        {/* Risk Overview Card - Volatility, VaR, CVaR, Monte Carlo */}
        <RiskOverviewCard
          volatility={analysis.volatility}
          stressTesting={analysis.stressTesting}
          riskDecomposition={analysis.riskDecomposition}
          correlation={analysis.correlation}
          viewTier={viewTier}
          isLoading={sectionLoadingStates.risk}
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
          isLoading={sectionLoadingStates.holdings}
        />
      </div>

      {/* Diversification Section - Correlation Clusters & Balance */}
      <div id="diversification-section" className="scroll-mt-32 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="w-6 h-6 text-cyan-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Diversification</h2>
          <ViewTierBadge viewTier={viewTier} />
        </div>

        {/* Correlation Clusters - Group visualization */}
        <CorrelationClustersCard
          riskDecomposition={analysis.riskDecomposition}
          viewTier={viewTier}
        />
      </div>

      {/* Fundamentals Section - P/E, Dividends, Beta */}
      <div id="fundamentals-section" className="scroll-mt-32 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fundamentals</h2>
          <ViewTierBadge viewTier={viewTier} />
        </div>

        <FundamentalsCard
          riskDecomposition={analysis.riskDecomposition}
          viewTier={viewTier}
        />
      </div>

      {/* Optimization Section - Strategy Comparison, Goals, What-If */}
      <div id="optimization-section" className="scroll-mt-32 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Optimization</h2>
          <ViewTierBadge viewTier={viewTier} />
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
          goalProjections={analysis.volatility?.goalProjections}
          monteCarloSimulations={analysis.volatility?.monteCarloSimulations}
          projectionYears={analysis.volatility?.projectionYears}
          historicalAnnualReturnPct={analysis.volatility?.historicalAnnualReturnPct}
          historicalAnnualVolatilityPct={analysis.volatility?.historicalAnnualVolatilityPct}
          goalProjectionStatus={analysis.volatility?.goalProjectionStatus}
          viewTier={viewTier}
        />

        {/* What-If Scenario Simulator */}
        <WhatIfSimulator
          holdings={holdings}
          currentVolatility={currentVol}
          currentBeta={portfolioBeta}
          currentConcentration={analysis.riskMetrics?.alphaBookHHI ?? 0}
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
                  <div className="text-sm text-gray-700 dark:text-gray-300">Understand the &quot;why&quot; behind each recommendation. See optimization strategies and implementation details.</div>
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

      {/* New Analysis Modal */}
      <NewAnalysisModal
        isOpen={newAnalysisOpen}
        onClose={() => setNewAnalysisOpen(false)}
        onAnalysisStarted={handleAnalysisStarted}
      />

      {/* Session Selector Modal (triggered from HeroCard) */}
      <SessionSelectorDialog
        open={showSessionSelector}
        onClose={() => setShowSessionSelector(false)}
        onSelectRun={handleRunChange}
        onStartNewAnalysis={handleOpenNewAnalysis}
        userName={user?.firstName}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
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
