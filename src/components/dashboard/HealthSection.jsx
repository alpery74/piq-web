import { Activity, Shield, Target, DollarSign, PieChart, TrendingUp, TrendingDown, BarChart3, Wallet, Scale } from 'lucide-react';
import ExpandableSection from './ExpandableSection';
import InfoTooltip from './InfoTooltip';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatNumber, formatPercent, formatCurrency } from '@/utils/formatters';

const HealthSection = ({
  analysis,
  portfolioBeta,
  explainedRiskPct,
  unexplainedRiskPct,
  highestBeta,
  lowestBeta,
  healthScore,
  healthLabel,
  concentrationPenalty,
  volatilityPenalty,
  tailPenalty,
  diversificationPenalty,
  riskLevelLabel,
  riskEmoji,
  currentVol,
  concentrationWeight,
  topRisk,
  showAdvanced,
  viewTier = 'simple', // 'simple', 'analyst', 'quant'
  activeTooltip,
  setActiveTooltip,
  isExpanded,
  onToggle,
}) => {
  const safePortfolioBeta = Number.isFinite(portfolioBeta) ? portfolioBeta : 0;
  const safeExplained = Number.isFinite(explainedRiskPct) ? explainedRiskPct : 0;
  const safeUnexplained = Number.isFinite(unexplainedRiskPct) ? unexplainedRiskPct : 0;
  const safeHighest = highestBeta || { ticker: 'Not available', value: 0 };
  const safeLowest = lowestBeta || { ticker: 'Not available', value: 0 };
  const displayScore = Number.isFinite(healthScore) ? healthScore : 0;
  const noHealthData = !Number.isFinite(healthScore);
  const safeConcentrationWeight = concentrationWeight || 0;
  const safeTopRisk = topRisk || { ticker: '—', contribution: 0, marginalRiskContribution: 0 };

  // Safe analysis property access helpers
  const safeRiskMetrics = analysis?.riskMetrics || {};
  const safeVolatility = analysis?.volatility || {};
  const safeStressTesting = analysis?.stressTesting || {};
  const safeRiskDecomposition = analysis?.riskDecomposition || {};
  const safeTopHolding = safeRiskMetrics.topHolding || { ticker: 'N/A', weightPct: 0 };
  const safeIdiosyncraticDetails = safeRiskDecomposition.idiosyncraticRiskAnalysis || safeRiskDecomposition.idiosyncraticDetails || {};
  const safeMarginalContributions = safeRiskDecomposition.marginalRiskContributions || safeRiskDecomposition.marginalContributions || [];

  // Tier 1: Portfolio fundamentals
  const weightedPeRatio = safeRiskMetrics.weightedPeRatio ?? null;
  const weightedDividendYieldPct = safeRiskMetrics.weightedDividendYieldPct ?? null;
  const weightedBeta = safeRiskMetrics.weightedBeta ?? null;
  const annualDividendIncome = safeRiskMetrics.annualDividendIncomeEstimate ?? null;
  const fundamentalsStatus = safeRiskMetrics.fundamentalsStatus || 'not_available';
  const hasFundamentalsData = fundamentalsStatus === 'complete' && weightedPeRatio !== null;

  // Tier 1: Market cap breakdown
  const marketCapMega = safeRiskMetrics.marketCapMegaPct ?? 0;
  const marketCapLarge = safeRiskMetrics.marketCapLargePct ?? 0;
  const marketCapMid = safeRiskMetrics.marketCapMidPct ?? 0;
  const marketCapSmall = safeRiskMetrics.marketCapSmallPct ?? 0;
  const marketCapMicro = safeRiskMetrics.marketCapMicroPct ?? 0;
  const hasMarketCapData = (marketCapMega + marketCapLarge + marketCapMid + marketCapSmall + marketCapMicro) > 0;

  // TIER 2: Cost Analysis (Feature #8)
  const safePerformance = analysis?.performance || {};
  const annualCostDrag = safePerformance.annualCostDragDollars ?? 0;
  const tenYearCost = safePerformance.tenYearProjectedCost ?? 0;
  const costAsPctReturns = safePerformance.costAsPctOfExpectedReturns ?? 0;
  const highestCostEtf = safePerformance.highestCostEtfTicker ?? null;
  const highestCostAmount = safePerformance.highestCostEtfAnnualDollars ?? 0;
  const costPerEtf = safePerformance.costPerEtf ?? [];
  const costAnalysisStatus = safePerformance.costAnalysisStatus ?? 'not_available';
  const hasCostData = costAnalysisStatus === 'complete' && annualCostDrag > 0;

  // TIER 2: Tax-Loss Harvesting (Feature #5)
  const taxLossOpportunities = safeRiskMetrics.taxLossHarvestingOpportunities ?? [];
  const harvestingCandidates = safeRiskMetrics.harvestingCandidates ?? [];
  const totalEstimatedLosses = safeRiskMetrics.totalEstimatedLosses ?? 0;
  const totalEstimatedGains = safeRiskMetrics.totalEstimatedGains ?? 0;
  const netUnrealizedGainLoss = safeRiskMetrics.netUnrealizedGainLoss ?? 0;
  const estimatedTaxSavings = safeRiskMetrics.estimatedTaxSavingsAt20pct ?? 0;
  const positionsWithLosses = safeRiskMetrics.positionsWithLosses ?? 0;
  const positionsWithGains = safeRiskMetrics.positionsWithGains ?? 0;
  const taxLossStatus = safeRiskMetrics.taxLossHarvestingStatus ?? 'not_available';
  const hasTaxLossData = taxLossStatus === 'complete';

  // TIER 2: Multi-Factor Exposure (Feature #7)
  const safeCorrelation = analysis?.correlation || {};
  const sizeFactorExposure = safeCorrelation.sizeFactorExposure ?? 0;
  const valueFactorExposure = safeCorrelation.valueFactorExposure ?? 0;
  const momentumFactorExposure = safeCorrelation.momentumFactorExposure ?? 0;
  const factorTilts = safeCorrelation.factorTilts ?? {};
  const sizeInterpretation = safeCorrelation.sizeInterpretation ?? null;
  const valueInterpretation = safeCorrelation.valueInterpretation ?? null;
  const momentumInterpretation = safeCorrelation.momentumInterpretation ?? null;
  const multiFactorStatus = safeCorrelation.multiFactorStatus ?? 'not_available';
  const hasFactorData = multiFactorStatus === 'complete';

  return (
    <section
      className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-100/70 dark:bg-amber-900/20 p-3 sm:p-4 lg:p-6 shadow-md scroll-mt-32 sm:scroll-mt-44"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">Portfolio Overview</p>
          <p className="text-sm text-amber-900 dark:text-amber-200">Your portfolio health at a glance.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="beta" iconSize={12}>
            <span>Beta:</span>
          </EducationalTooltip>
          {safePortfolioBeta.toFixed(2)}
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="rSquared" iconSize={12}>
            <span>Explained:</span>
          </EducationalTooltip>
          {safeExplained.toFixed(1)}%
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="idiosyncraticRisk" iconSize={12}>
            <span>Unexplained:</span>
          </EducationalTooltip>
          {safeUnexplained.toFixed(1)}%
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="beta" iconSize={12}>
            <span>High β:</span>
          </EducationalTooltip>
          {safeHighest.ticker} ({(safeHighest.value || 0).toFixed(2)})
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="beta" iconSize={12}>
            <span>Low β:</span>
          </EducationalTooltip>
          {safeLowest.ticker} ({(safeLowest.value || 0).toFixed(2)})
        </span>
      </div>

      {/* Tier 1: Portfolio Fundamentals Badges */}
      {hasFundamentalsData && (
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-300 font-semibold inline-flex items-center gap-1">
            <EducationalTooltip term="peRatio" iconSize={12}>
              <span>P/E:</span>
            </EducationalTooltip>
            {weightedPeRatio !== null ? weightedPeRatio.toFixed(1) : 'N/A'}
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 font-semibold inline-flex items-center gap-1">
            <EducationalTooltip term="dividendYield" iconSize={12}>
              <span>Div Yield:</span>
            </EducationalTooltip>
            {weightedDividendYieldPct !== null ? `${weightedDividendYieldPct.toFixed(2)}%` : 'N/A'}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 font-semibold inline-flex items-center gap-1">
            <EducationalTooltip term="beta" iconSize={12}>
              <span>Wtd β:</span>
            </EducationalTooltip>
            {weightedBeta !== null ? weightedBeta.toFixed(2) : 'N/A'}
          </span>
          {annualDividendIncome !== null && annualDividendIncome > 0 && (
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold inline-flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>Est. Income:</span>
              {formatCurrency(annualDividendIncome, 0)}/yr
            </span>
          )}
        </div>
      )}

      {/* Tier 1: Market Cap Breakdown */}
      {hasMarketCapData && (
        <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Market Cap Breakdown</span>
          </div>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden">
            {marketCapMega > 0 && (
              <div
                className="bg-purple-500 dark:bg-purple-400"
                style={{ width: `${marketCapMega}%` }}
                title={`Mega Cap: ${marketCapMega.toFixed(1)}%`}
              />
            )}
            {marketCapLarge > 0 && (
              <div
                className="bg-blue-500 dark:bg-blue-400"
                style={{ width: `${marketCapLarge}%` }}
                title={`Large Cap: ${marketCapLarge.toFixed(1)}%`}
              />
            )}
            {marketCapMid > 0 && (
              <div
                className="bg-green-500 dark:bg-green-400"
                style={{ width: `${marketCapMid}%` }}
                title={`Mid Cap: ${marketCapMid.toFixed(1)}%`}
              />
            )}
            {marketCapSmall > 0 && (
              <div
                className="bg-orange-500 dark:bg-orange-400"
                style={{ width: `${marketCapSmall}%` }}
                title={`Small Cap: ${marketCapSmall.toFixed(1)}%`}
              />
            )}
            {marketCapMicro > 0 && (
              <div
                className="bg-red-500 dark:bg-red-400"
                style={{ width: `${marketCapMicro}%` }}
                title={`Micro Cap: ${marketCapMicro.toFixed(1)}%`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
            {marketCapMega > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Mega {marketCapMega.toFixed(0)}%</span>
              </span>
            )}
            {marketCapLarge > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Large {marketCapLarge.toFixed(0)}%</span>
              </span>
            )}
            {marketCapMid > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Mid {marketCapMid.toFixed(0)}%</span>
              </span>
            )}
            {marketCapSmall > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Small {marketCapSmall.toFixed(0)}%</span>
              </span>
            )}
            {marketCapMicro > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Micro {marketCapMicro.toFixed(0)}%</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* TIER 2: Multi-Factor Exposure Badges (Feature #7) - ALL views */}
      {hasFactorData && (
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className={`px-3 py-1 rounded-full border font-semibold inline-flex items-center gap-1 ${
            factorTilts.sizeTilt === 'small_cap'
              ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300'
              : factorTilts.sizeTilt === 'large_cap'
              ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300'
              : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            <Scale className="w-3 h-3" />
            <span>Size:</span>
            {factorTilts.sizeTilt === 'small_cap' ? 'Small Cap' : factorTilts.sizeTilt === 'large_cap' ? 'Large Cap' : 'Balanced'}
          </span>
          <span className={`px-3 py-1 rounded-full border font-semibold inline-flex items-center gap-1 ${
            factorTilts.valueTilt === 'value'
              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300'
              : factorTilts.valueTilt === 'growth'
              ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-700 text-pink-800 dark:text-pink-300'
              : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            <BarChart3 className="w-3 h-3" />
            <span>Style:</span>
            {factorTilts.valueTilt === 'value' ? 'Value' : factorTilts.valueTilt === 'growth' ? 'Growth' : 'Blend'}
          </span>
          <span className={`px-3 py-1 rounded-full border font-semibold inline-flex items-center gap-1 ${
            factorTilts.momentumTilt === 'high_momentum'
              ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
              : factorTilts.momentumTilt === 'low_momentum'
              ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
              : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            <TrendingUp className="w-3 h-3" />
            <span>Momentum:</span>
            {factorTilts.momentumTilt === 'high_momentum' ? 'High' : factorTilts.momentumTilt === 'low_momentum' ? 'Low' : 'Neutral'}
          </span>
        </div>
      )}

      {/* TIER 2: Cost Analysis Card (Feature #8) - ALL views */}
      {hasCostData && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-700">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">ETF Cost Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400">Annual Fee Drag</p>
              <p className="text-lg font-bold text-rose-800 dark:text-rose-200">{formatCurrency(annualCostDrag, 0)}</p>
            </div>
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400">10-Year Projected</p>
              <p className="text-lg font-bold text-rose-800 dark:text-rose-200">{formatCurrency(tenYearCost, 0)}</p>
            </div>
          </div>
          {/* Analyst+ view: More details */}
          {(viewTier === 'analyst' || viewTier === 'quant') && (
            <div className="mt-3 pt-3 border-t border-rose-200 dark:border-rose-700">
              <div className="flex justify-between text-xs">
                <span className="text-rose-600 dark:text-rose-400">% of Expected Returns:</span>
                <span className="font-semibold text-rose-800 dark:text-rose-200">{costAsPctReturns.toFixed(1)}%</span>
              </div>
              {highestCostEtf && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-rose-600 dark:text-rose-400">Highest Cost ETF:</span>
                  <span className="font-semibold text-rose-800 dark:text-rose-200">{highestCostEtf} ({formatCurrency(highestCostAmount, 0)}/yr)</span>
                </div>
              )}
            </div>
          )}
          {/* Quant view: Full breakdown */}
          {viewTier === 'quant' && costPerEtf.length > 0 && (
            <div className="mt-3 pt-3 border-t border-rose-200 dark:border-rose-700">
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mb-2">Per-ETF Breakdown:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {costPerEtf.slice(0, 5).map((etf, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-rose-600 dark:text-rose-400">{etf.ticker} ({etf.expenseRatioPct?.toFixed(2)}%)</span>
                    <span className="font-mono text-rose-800 dark:text-rose-200">{formatCurrency(etf.annualCostDollars, 0)}/yr</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TIER 2: Tax-Loss Harvesting Card (Feature #5) - ALL views */}
      {hasTaxLossData && (
        <div className={`mb-4 p-3 rounded-xl border ${
          netUnrealizedGainLoss >= 0
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {netUnrealizedGainLoss >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
            <span className={`text-xs font-semibold ${
              netUnrealizedGainLoss >= 0 ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'
            }`}>Unrealized Gains/Losses</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`text-xs ${netUnrealizedGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>Net Position</p>
              <p className={`text-lg font-bold ${netUnrealizedGainLoss >= 0 ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`}>
                {netUnrealizedGainLoss >= 0 ? '+' : ''}{formatCurrency(netUnrealizedGainLoss, 0)}
              </p>
            </div>
            {estimatedTaxSavings > 0 && (
              <div>
                <p className="text-xs text-amber-600 dark:text-amber-400">Potential Tax Savings</p>
                <p className="text-lg font-bold text-amber-800 dark:text-amber-200">{formatCurrency(estimatedTaxSavings, 0)}</p>
              </div>
            )}
          </div>
          {/* Analyst+ view: Position breakdown */}
          {(viewTier === 'analyst' || viewTier === 'quant') && (
            <div className="mt-3 pt-3 border-t border-current opacity-20">
              <div className="flex justify-between text-xs">
                <span className="opacity-70">Positions with gains:</span>
                <span className="font-semibold text-green-700 dark:text-green-300">{positionsWithGains} (+{formatCurrency(totalEstimatedGains, 0)})</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="opacity-70">Positions with losses:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{positionsWithLosses} (-{formatCurrency(totalEstimatedLosses, 0)})</span>
              </div>
            </div>
          )}
          {/* Quant view: Harvesting candidates */}
          {viewTier === 'quant' && harvestingCandidates.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current opacity-20">
              <p className="text-xs font-semibold mb-2">Tax-Loss Harvesting Candidates:</p>
              <div className="space-y-1">
                {harvestingCandidates.slice(0, 3).map((candidate, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-red-100/50 dark:bg-red-900/30 px-2 py-1 rounded">
                    <span className="font-medium">{candidate.ticker}</span>
                    <span className="text-red-600 dark:text-red-400">{candidate.estimatedGainLossPct?.toFixed(1)}% ({formatCurrency(candidate.estimatedGainLossDollars, 0)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ExpandableSection
        id="health-score"
        title="Portfolio Health Score"
        icon={Activity}
        isExpanded={isExpanded}
        onToggle={onToggle}
        showAdvanced={showAdvanced}
        tier1={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * displayScore) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-amber-600">
                    {noHealthData ? '—' : Math.round(displayScore)}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">/ 100</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
                  <span className="text-2xl font-bold text-amber-800">{healthLabel}</span>
                  <InfoTooltip
                    id="health-tooltip"
                    content={noHealthData ? 'Awaiting live analysis data' : 'Health score factors in concentration, volatility, tail risk, and diversification.'}
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {noHealthData
                    ? 'Waiting for live results to calculate your health score.'
                    : healthLabel === 'Excellent'
                    ? 'Great balance of risk and diversification.'
                    : 'Room for improvement to reach Excellent (80+).'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Score Components</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <EducationalTooltip term="hhi" iconSize={14}>
                      <span>Concentration Risk</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">-{concentrationPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${concentrationPenalty}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <EducationalTooltip term="volatility" iconSize={14}>
                      <span>Volatility</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">-{volatilityPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${volatilityPenalty}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <EducationalTooltip term="tailRisk" iconSize={14}>
                      <span>Tail Risk</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">-{tailPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${tailPenalty}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <EducationalTooltip term="effectiveHoldings" iconSize={14}>
                      <span>Diversification</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">-{diversificationPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${diversificationPenalty * 2}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-2 bg-green-100 dark:bg-green-900/40 rounded">
                  <div className="font-bold text-green-800 dark:text-green-300">Excellent</div>
                  <div className="text-green-600 dark:text-green-400">80-100</div>
                </div>
                <div className="text-center p-2 bg-amber-100 dark:bg-amber-900/40 rounded">
                  <div className="font-bold text-amber-800 dark:text-amber-300">Good</div>
                  <div className="text-amber-600 dark:text-amber-400">60-79</div>
                </div>
                <div className="text-center p-2 bg-orange-100 dark:bg-orange-900/40 rounded">
                  <div className="font-bold text-orange-800 dark:text-orange-300">Fair</div>
                  <div className="text-orange-600 dark:text-orange-400">40-59</div>
                </div>
                <div className="text-center p-2 bg-red-100 dark:bg-red-900/40 rounded">
                  <div className="font-bold text-red-800 dark:text-red-300">Poor</div>
                  <div className="text-red-600 dark:text-red-400">0-39</div>
                </div>
              </div>
            </div>
          </div>
        }
        tier2={
          <div className="text-blue-900 dark:text-blue-100 space-y-4">
            <p className="leading-relaxed">
              Your health score evaluates four critical dimensions of portfolio construction. Think of it as a report card
              for your investments:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="font-bold mb-2 text-gray-900 dark:text-white">🎯 Concentration (-15)</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your largest position ({safeTopHolding.ticker}{' '}
                  {formatPercent((safeTopHolding.weightPct ?? 0) / 100, 1)}) exceeds the recommended 10-15%
                  maximum, creating unnecessary risk concentration.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="font-bold mb-2 text-gray-900 dark:text-white">📊 Volatility (-10)</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Annual swings of {formatPercent(currentVol / 100, 1)}. Most balanced portfolios target 12-15% volatility.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="font-bold mb-2 text-gray-900 dark:text-white">⚠️ Tail Risk (-10)</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  In severe market crashes, crisis drawdown projects around{' '}
                  {formatPercent(analysis.stressTesting?.maxDrawdowns?.crisis ?? 0, 0)}, indicating high extreme-event
                  vulnerability.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="font-bold mb-2 text-gray-900 dark:text-white">🔀 Diversification (-5)</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  With {formatNumber(analysis.riskMetrics?.effectiveHoldings ?? 0, 1)} effective holdings, you&apos;re slightly
                  under-diversified. Target 10+ for optimal risk spreading.
                </p>
              </div>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 p-4 rounded-lg mt-4">
              <div className="font-bold mb-2 text-blue-900 dark:text-blue-200">✅ Path to 85+ Score:</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <li>Reduce LW position from 23% to 10-12% (+10 points)</li>
                <li>Add 3-4 more positions for better diversification (+5 points)</li>
                <li>Implement optimization strategies below (+5-8 points)</li>
              </ul>
            </div>
          </div>
        }
        tier3={
          <div className="text-purple-900 dark:text-purple-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-base mb-3 border-b border-purple-300 dark:border-purple-700 pb-2 text-gray-900 dark:text-white">Calculation Formula</h4>
                <div className="font-mono text-sm space-y-2 bg-white/70 dark:bg-gray-800/70 p-4 rounded">
                  <div>
                    Base Score: <span className="font-bold">100</span>
                  </div>
                  <div className="text-red-600">
                    - HHI Penalty: <span className="font-bold">{concentrationPenalty}</span>
                    <div className="text-xs ml-4">HHI = {(safeRiskMetrics.alphaBookHHI ?? 0).toFixed(3)} &gt; threshold (0.15)</div>
                  </div>
                  <div className="text-orange-600">
                    - Vol Penalty: <span className="font-bold">{volatilityPenalty}</span>
                    <div className="text-xs ml-4">σ = {formatPercent(currentVol / 100, 2)} (target ≤ 15%)</div>
                  </div>
                  <div className="text-orange-600">
                    - Tail Penalty: <span className="font-bold">{tailPenalty}</span>
                    <div className="text-xs ml-4">Tail Risk = {safeStressTesting.tailRiskAssessment?.tailRiskLevel ?? safeStressTesting.tail_risk_assessment?.tail_risk_level ?? 'N/A'}</div>
                  </div>
                  <div className="text-yellow-600">
                    - Div Penalty: <span className="font-bold">{diversificationPenalty}</span>
                    <div className="text-xs ml-4">
                      Effective Holdings = {(safeRiskMetrics.effectiveHoldings ?? 0).toFixed(1)} &lt; 10
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-purple-300 text-lg">
                    = Final Score: <span className="font-bold text-purple-700">{Math.round(healthScore)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-base mb-3 border-b border-purple-300 dark:border-purple-700 pb-2 text-gray-900 dark:text-white">Risk Adjustments</h4>
                <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Optimization Impact</span>
                    <span className="font-bold text-green-700 dark:text-green-400">-25% σ</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Diversification Benefit</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      {((safeIdiosyncraticDetails.diversificationBenefit ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Systematic Risk</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {(safeRiskDecomposition.systematicRiskContributionPct ?? 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Idiosyncratic Risk</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {(safeRiskDecomposition.idiosyncraticRiskScorePct ?? 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Portfolio Volatility</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatPercent(safeIdiosyncraticDetails.portfolioVolatility ?? 0, 2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Weighted Indiv. Vol</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatPercent(safeIdiosyncraticDetails.weightedIndividualVolatility ?? 0, 2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 p-5 rounded-lg border-l-4 border-amber-400 dark:border-amber-500">
              <h4 className="font-bold mb-2 text-amber-900 dark:text-amber-300">Concentration Impact</h4>
              <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
                Current weight: {safeConcentrationWeight.toFixed(1)}%. Each -1% reduction lowers risk contribution by{' '}
                {(safeTopRisk.contribution ?? 0) > 0 && safeConcentrationWeight > 0 ? ((safeTopRisk.contribution ?? 0) / safeConcentrationWeight).toFixed(2) : '0.00'} percentage points.
              </p>
              <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                <div>
                  If reduced to 16%: risk ↓ to {safeConcentrationWeight > 0 ? ((safeTopRisk.contribution ?? 0) * (16 / safeConcentrationWeight)).toFixed(1) : '0.0'}%
                </div>
                <div>
                  If reduced to 10%: risk ↓ to {safeConcentrationWeight > 0 ? ((safeTopRisk.contribution ?? 0) * (10 / safeConcentrationWeight)).toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <InfoTooltip
                  id="risk-tooltip"
                  title="Annual Volatility"
                  content="Measures how much your portfolio value typically swings up or down in a year. Lower is more stable."
                  activeTooltip={activeTooltip}
                  setActiveTooltip={setActiveTooltip}
                />
              </div>
            </div>
          </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{riskLevelLabel}</span>
          <span className="text-4xl">{riskEmoji}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{formatPercent(currentVol / 100, 1)} annual volatility</p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div className="bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-full relative">
            <div className="absolute left-[53%] top-0 w-1 h-3 bg-white dark:bg-gray-900 border-2 border-gray-800 dark:border-gray-200"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Low (0-10%)</span>
          <span>High (&gt;25%)</span>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t-2 border-purple-200 dark:border-purple-800 space-y-2 bg-purple-50/50 dark:bg-purple-900/30 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sharpe Ratio:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{(safeVolatility.sharpe ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Market Beta:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{safePortfolioBeta.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">95% VaR:</span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">{(safeVolatility.var95DailyPct ?? 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">CVaR:</span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">{(safeVolatility.cvar95DailyPct ?? 0).toFixed(2)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Diversification</p>
              <InfoTooltip
                id="div-tooltip"
                title="Effective Holdings"
                content="How many truly independent positions you hold. Higher means better risk spreading across different investments."
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
              />
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{(safeRiskMetrics.effectiveHoldings ?? 0).toFixed(1)}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">effective holdings</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Target 10+ for stronger diversification.</p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-red-500 via-amber-500 to-green-500 h-3 rounded-full relative"
            style={{ width: '100%' }}
          >
            <div
              className="absolute left-[20%] top-0 w-1 h-3 bg-gray-800 dark:bg-gray-200"
              style={{ left: `${Math.min(100, (safeRiskMetrics.effectiveHoldings ?? 0) * 10)}%` }}
            >
              <div className="absolute -top-6 -left-1 text-xs font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">You</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>Concentrated (&lt;5)</span>
          <span>Optimal (10+)</span>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t-2 border-purple-200 dark:border-purple-800 space-y-2 bg-purple-50/50 dark:bg-purple-900/30 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">HHI Score:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{(safeRiskMetrics.alphaBookHHI ?? 0).toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Gini Coefficient:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{(safeRiskMetrics.gini ?? 0).toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sectors:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {safeRiskMetrics.largestSector ?? 'N/A'} ({(safeRiskMetrics.largestSectorPct ?? 0).toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concentration</p>
              <InfoTooltip
                id="conc-tooltip"
                title="Position Weight"
                content="Shows how far your largest position sits from recommended max weight."
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
              />
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{safeConcentrationWeight.toFixed(1)}%</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Top holding weight</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {safeTopHolding.ticker} drives {(safeTopRisk.contribution ?? 0).toFixed(1)}% of portfolio risk.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Recommended max</span>
            <span className="font-semibold">10-15%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-full relative">
              <div className="absolute right-[10%] top-0 w-1 h-3 bg-gray-800 dark:bg-gray-200">
                <div className="absolute -top-6 right-0 text-xs font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">You →</div>
              </div>
              <div className="absolute left-[15%] top-0 w-1 h-3 bg-white dark:bg-gray-900">
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">← Max</div>
              </div>
            </div>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t-2 border-purple-200 dark:border-purple-800 space-y-2 bg-purple-50/50 dark:bg-purple-900/30 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Risk Contribution:</span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">
                {(safeMarginalContributions
                  .find((m) => m.ticker === safeTopHolding.ticker)
                  ?.contribution ?? 0).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sector:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">Consumer Defensive</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">$8.8B</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">46.1%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
  );
};

export default HealthSection;
