import { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Zap,
  Calendar,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatPercent, formatNumber } from '@/utils/formatters';

/**
 * RiskOverviewCard - Comprehensive risk metrics display
 * Shows volatility, VaR, CVaR, simulation stats, and stress test results
 */
const RiskOverviewCard = ({
  volatility,
  stressTesting,
  riskDecomposition,
  correlation,
  viewTier = 'simple', // 'simple', 'analyst', 'quant'
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Extract data with safe defaults
  const annualizedVol = volatility?.predictiveVolatilityAnnualizedPct || volatility?.annualizedPct || 0;
  const sharpeRatio = volatility?.predictiveSharpeRatio || volatility?.sharpe || 0;
  const var95 = volatility?.historicalVar95DailyPct || volatility?.var95DailyPct || 0;
  const cvar95 = volatility?.historicalCvar95DailyPct || volatility?.cvar95DailyPct || 0;
  const stressShock = volatility?.stressTestFactorShockMinus20pct || 0;
  const worstDay = volatility?.simulationWorstDayPct || 0;
  const bestDay = volatility?.simulationBestDayPct || 0;
  const simDays = volatility?.simulationDaysCount || 0;
  const limitedHistory = volatility?.limitedHistory || false;

  // Beta exposure
  const betaExposureUsd = correlation?.betaExposureUsd || 0;
  const avgAssetRSquared = correlation?.avgAssetRSquaredPct || 0;

  // Regression metadata (for Analyst/Quant views)
  const regressionBenchmark = correlation?.regressionBenchmarkTicker || 'SPY';
  const regressionAssetsCount = correlation?.regressionAssetsCount || 0;
  const totalWeightAnalyzed = correlation?.totalWeightAnalyzed || 0;

  // Correlation stress testing
  const correlationStress = stressTesting?.correlationStressTesting || {};
  const maxCorrelationIncrease = correlationStress?.maxCorrelationIncrease || 0;
  const correlationBreakdownRisk = correlationStress?.correlationBreakdownRisk || 'UNKNOWN';
  const stressScenarios = correlationStress?.stressScenarios || [];

  // Monte Carlo data
  const monteCarlo = stressTesting?.monteCarloAnalysis || {};
  const returnDist = monteCarlo?.returnDistribution || {};
  const drawdownDist = monteCarlo?.drawdownDistribution || {};
  const mcRiskMetrics = monteCarlo?.riskMetrics || {};

  // Stress scenarios
  const maxDrawdowns = stressTesting?.maximumDrawdownProjections?.drawdownScenarios || {};
  const tailRisk = stressTesting?.tailRiskAssessment || {};

  // Implementation risk
  const implRisk = stressTesting?.implementationRiskScores || {};

  // Determine risk level
  const riskLevel = annualizedVol < 10 ? 'Low' : annualizedVol < 20 ? 'Moderate' : 'High';
  const riskColor = riskLevel === 'Low' ? 'text-ios-green' : riskLevel === 'Moderate' ? 'text-ios-orange' : 'text-ios-red';
  const riskBg = riskLevel === 'Low' ? 'bg-green-100 dark:bg-green-900/30' : riskLevel === 'Moderate' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isLoading ? 'bg-gray-100 dark:bg-gray-700' : riskBg}`}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Activity className={`w-5 h-5 ${riskColor}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risk Overview</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? 'Analyzing risk metrics...' : (
                <>
                  {simDays} days analyzed {limitedHistory ? '(limited history)' : ''}
                  {(viewTier === 'analyst' || viewTier === 'quant') && regressionBenchmark && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                      vs {regressionBenchmark}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500">
            Loading...
          </div>
        ) : (
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${riskBg} ${riskColor}`}>
            {riskLevel} Risk
          </div>
        )}
      </div>

      {/* Simple Tier - Key Metrics */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Volatility */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="volatility" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Annual Volatility</span>
            </EducationalTooltip>
            <div className={`text-2xl font-bold mt-1 ${riskColor}`}>
              {formatPercent(annualizedVol / 100, 1)}
            </div>
          </div>

          {/* Sharpe Ratio */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="sharpeRatio" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sharpe Ratio</span>
            </EducationalTooltip>
            <div className={`text-2xl font-bold mt-1 ${sharpeRatio >= 1 ? 'text-ios-green' : sharpeRatio >= 0 ? 'text-ios-orange' : 'text-ios-red'}`}>
              {sharpeRatio.toFixed(2)}
            </div>
          </div>

          {/* VaR */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="var" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily VaR 95%</span>
            </EducationalTooltip>
            <div className="text-2xl font-bold mt-1 text-ios-red">
              {var95.toFixed(2)}%
            </div>
          </div>

          {/* CVaR */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="cvar" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily CVaR 95%</span>
            </EducationalTooltip>
            <div className="text-2xl font-bold mt-1 text-ios-red">
              {cvar95.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Simulation Extremes - Always show */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <TrendingUp className="w-8 h-8 text-ios-green" />
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Best Simulated Day</div>
              <div className="text-xl font-bold text-ios-green">+{bestDay.toFixed(2)}%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <TrendingDown className="w-8 h-8 text-ios-red" />
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Worst Simulated Day</div>
              <div className="text-xl font-bold text-ios-red">{worstDay.toFixed(2)}%</div>
            </div>
          </div>
        </div>

        {/* Analyst Tier - Stress Scenarios */}
        {(viewTier === 'analyst' || viewTier === 'quant') && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Stress Scenarios
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Normal */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-800 dark:text-green-300">Normal</span>
                  <span className="text-xs px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                    {((maxDrawdowns.normalConditions?.probability || 0.7) * 100).toFixed(0)}% prob
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {formatPercent(maxDrawdowns.normalConditions?.expectedMaxDrawdown || -0.12, 1)}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">Max Drawdown</div>
              </div>

              {/* Stress */}
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-orange-800 dark:text-orange-300">Stress</span>
                  <span className="text-xs px-2 py-0.5 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full">
                    {((maxDrawdowns.stressConditions?.probability || 0.25) * 100).toFixed(0)}% prob
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {formatPercent(maxDrawdowns.stressConditions?.expectedMaxDrawdown || -0.24, 1)}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Max Drawdown</div>
              </div>

              {/* Crisis */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-red-800 dark:text-red-300">Crisis</span>
                  <span className="text-xs px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full">
                    {((maxDrawdowns.crisisConditions?.probability || 0.05) * 100).toFixed(0)}% prob
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {formatPercent(maxDrawdowns.crisisConditions?.expectedMaxDrawdown || -0.40, 1)}
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">Max Drawdown</div>
              </div>
            </div>

            {/* Market Shock */}
            {stressShock !== 0 && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      If market drops 20%
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-400">
                    {stressShock.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}

            {/* Probability Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <EducationalTooltip term="probabilityOfLoss" iconSize={12}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Probability of Annual Loss</span>
                </EducationalTooltip>
                <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {((mcRiskMetrics.probabilityOfLoss || 0) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Probability of Large Loss (&gt;20%)</span>
                <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {((mcRiskMetrics.probabilityOfLargeLoss || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Correlation Stress Scenarios */}
            {stressScenarios.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Historical Crisis Scenarios
                </h4>
                <div className="space-y-2">
                  {stressScenarios.map((scenario, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                          {scenario.name}
                        </span>
                        <span className={`font-bold ${
                          (scenario.portfolioImpactPct || 0) < -20 ? 'text-red-600' :
                          (scenario.portfolioImpactPct || 0) < -10 ? 'text-orange-600' : 'text-amber-600'
                        }`}>
                          {(scenario.portfolioImpactPct || 0).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        {scenario.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quant Tier - Full Details */}
        {viewTier === 'quant' && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? 'Hide' : 'Show'} Monte Carlo Distribution
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                {/* Return Distribution */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                    Annual Return Distribution ({monteCarlo.simulationParameters?.nSimulations || 1000} simulations)
                  </h5>
                  <div className="grid grid-cols-5 gap-2 text-center text-sm">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500">5th %ile</div>
                      <div className="font-bold text-red-600">{formatPercent(returnDist.percentileFive || 0, 1)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500">25th %ile</div>
                      <div className="font-bold text-orange-600">{formatPercent(returnDist.percentileTwentyfive || 0, 1)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-300">
                      <div className="text-xs text-gray-500">Median</div>
                      <div className="font-bold text-purple-700">{formatPercent(returnDist.percentileFifty || 0, 1)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500">75th %ile</div>
                      <div className="font-bold text-blue-600">{formatPercent(returnDist.percentileSeventyfive || 0, 1)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500">95th %ile</div>
                      <div className="font-bold text-green-600">{formatPercent(returnDist.percentileNinetyfive || 0, 1)}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Mean Return</span>
                      <span className="font-mono font-semibold">{formatPercent(returnDist.mean || 0, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Std Dev</span>
                      <span className="font-mono font-semibold">{formatPercent(returnDist.std || 0, 2)}</span>
                    </div>
                  </div>
                </div>

                {/* Drawdown Distribution */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h5 className="font-semibold text-red-800 dark:text-red-300 mb-3">Drawdown Distribution</h5>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Mean Max DD</div>
                      <div className="font-bold text-red-600">{formatPercent(drawdownDist.meanMaxDrawdown || 0, 1)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-xs text-gray-500">5th %ile DD</div>
                      <div className="font-bold text-red-700">{formatPercent(drawdownDist.percentileFiveDrawdown || 0, 1)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Median DD</div>
                      <div className="font-bold text-red-600">{formatPercent(drawdownDist.percentileFiftyDrawdown || 0, 1)}</div>
                    </div>
                  </div>
                </div>

                {/* Implementation Risk */}
                {implRisk.overallImplementationRisk !== undefined && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Implementation Risk Scores</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">Liquidity Risk</div>
                        <div className="font-bold">{(implRisk.riskComponents?.liquidityRisk || 0).toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Concentration Risk</div>
                        <div className="font-bold">{(implRisk.riskComponents?.concentrationRisk || 0).toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Market Impact</div>
                        <div className="font-bold">{(implRisk.riskComponents?.marketImpactRisk || 0).toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Timing Risk</div>
                        <div className="font-bold">{(implRisk.riskComponents?.timingRisk || 0).toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Overall Implementation Risk</span>
                      <span className={`font-bold ${
                        implRisk.riskLevel === 'LOW' ? 'text-ios-green' :
                        implRisk.riskLevel === 'MEDIUM' ? 'text-ios-orange' : 'text-ios-red'
                      }`}>
                        {(implRisk.overallImplementationRisk || 0).toFixed(1)} ({implRisk.riskLevel})
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-500">Beta Exposure (USD)</div>
                    <div className="font-bold">${betaExposureUsd.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-500">Avg Asset R²</div>
                    <div className="font-bold">{avgAssetRSquared.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <EducationalTooltip term="tailRisk" iconSize={12}>
                      <span className="text-xs text-gray-500">Tail Risk Level</span>
                    </EducationalTooltip>
                    <div className={`font-bold ${
                      tailRisk.tailRiskLevel === 'LOW' ? 'text-ios-green' :
                      tailRisk.tailRiskLevel === 'MODERATE' ? 'text-ios-orange' : 'text-ios-red'
                    }`}>
                      {tailRisk.tailRiskLevel || 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-xs text-gray-500">Expected Shortfall (5%)</span>
                    <div className="font-bold text-ios-red">
                      {formatPercent(mcRiskMetrics.expectedShortfallFivePct || 0, 1)}
                    </div>
                  </div>
                </div>

                {/* Regression Analysis Metadata */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Regression Analysis</h5>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Benchmark</div>
                      <div className="font-bold text-blue-700 dark:text-blue-300">{regressionBenchmark}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Assets Analyzed</div>
                      <div className="font-bold text-gray-900 dark:text-white">{regressionAssetsCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Weight Coverage</div>
                      <div className="font-bold text-gray-900 dark:text-white">{totalWeightAnalyzed.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* Correlation Breakdown Risk */}
                {(maxCorrelationIncrease > 0 || correlationBreakdownRisk !== 'UNKNOWN') && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <h5 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">Correlation Stress Analysis</h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Max Correlation Increase</div>
                        <div className="font-bold text-amber-700 dark:text-amber-300">
                          +{(maxCorrelationIncrease * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">Under market stress</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Breakdown Risk</div>
                        <div className={`font-bold ${
                          correlationBreakdownRisk === 'LOW' ? 'text-ios-green' :
                          correlationBreakdownRisk === 'MODERATE' ? 'text-ios-orange' : 'text-ios-red'
                        }`}>
                          {correlationBreakdownRisk}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">Diversification failure risk</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskOverviewCard;
