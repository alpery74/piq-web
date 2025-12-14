import { useState } from 'react';
import {
  Target,
  TrendingUp,
  Shield,
  Scale,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BarChart3,
  Leaf,
  Award,
  AlertCircle,
} from 'lucide-react';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatPercent, formatCurrency } from '@/utils/formatters';

/**
 * StrategyComparisonCard - Full optimization strategy comparison
 * Shows all available strategies with costs, expected outcomes, and benchmarks
 */
const StrategyComparisonCard = ({
  strategies,
  esgOptimization,
  showEsgMode,
  onToggleEsgMode,
  currentVolatility,
  viewTier = 'simple',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  // ESG data extraction
  const esgAvailable = esgOptimization?.status === 'available';
  const portfolioEsg = esgOptimization?.portfolioEsg;
  const esgStrategies = esgOptimization?.strategies;

  // Extract strategy data
  const availableStrategies = strategies?.availableStrategies || {};
  const recommended = strategies?.recommendedStrategy || {};
  const costEstimates = strategies?.implementationCostEstimates || {};
  const comparison = strategies?.strategyComparison || {};
  const benchmarkComparison = comparison.benchmarkComparison || {};

  // If no strategies, don't render
  if (!strategies || Object.keys(availableStrategies).length === 0) {
    return null;
  }

  // Strategy display config
  const strategyConfig = {
    minimumVariance: {
      label: 'Minimum Variance',
      shortLabel: 'Min Var',
      icon: Shield,
      color: 'blue',
      description: 'Lowest possible volatility',
      term: 'minimumVariance',
    },
    riskParity: {
      label: 'Risk Parity',
      shortLabel: 'Risk Parity',
      icon: Scale,
      color: 'purple',
      description: 'Equal risk from each position',
      term: 'riskParity',
    },
    maximumDiversification: {
      label: 'Maximum Diversification',
      shortLabel: 'Max Div',
      icon: Target,
      color: 'green',
      description: 'Maximum diversification benefit',
      term: 'maxDiversification',
    },
    alphaTilted: {
      label: 'Alpha Tilted',
      shortLabel: 'Alpha',
      icon: TrendingUp,
      color: 'orange',
      description: 'Overweight expected winners',
      term: 'alpha',
    },
  };

  // ESG Strategy display config
  const esgStrategyConfig = {
    esg_tilted_minimum_variance: {
      label: 'ESG-Tilted Min Var',
      shortLabel: 'ESG Min Var',
      icon: Leaf,
      color: 'green',
      description: 'Lower volatility with ESG tilt',
    },
    esg_improvement: {
      label: 'ESG Improvement',
      shortLabel: 'ESG Improve',
      icon: TrendingUp,
      color: 'emerald',
      description: 'Reduce low-ESG holdings',
    },
    esg_leaders: {
      label: 'ESG Leaders',
      shortLabel: 'ESG Leaders',
      icon: Award,
      color: 'teal',
      description: 'Overweight high-ESG stocks',
    },
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-100 dark:bg-blue-800',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-100 dark:bg-purple-800',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-100 dark:bg-green-800',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-300',
      badge: 'bg-orange-100 dark:bg-orange-800',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-100 dark:bg-emerald-800',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      border: 'border-teal-200 dark:border-teal-800',
      text: 'text-teal-700 dark:text-teal-300',
      badge: 'bg-teal-100 dark:bg-teal-800',
    },
  };

  // Convert strategies to array for display
  const strategyList = Object.entries(availableStrategies)
    .filter(([, data]) => data.available)
    .map(([key, data]) => ({
      key,
      ...data,
      config: strategyConfig[key] || { label: key, icon: Target, color: 'gray' },
      costs: costEstimates[key] || {},
      benchmarkData: benchmarkComparison.strategyComparisons?.[key] || {},
      isRecommended: recommended.recommended === key,
    }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Optimization Strategies</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {strategyList.length} strategies available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* ESG Mode Toggle */}
          {esgAvailable && (
            <button
              onClick={() => onToggleEsgMode?.(!showEsgMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                showEsgMode
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={showEsgMode ? 'Switch to Standard Optimization' : 'Switch to ESG-Aware Optimization'}
            >
              <Leaf className="w-4 h-4" />
              ESG
            </button>
          )}
          {recommended.recommended && !showEsgMode && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {strategyConfig[recommended.recommended]?.shortLabel || recommended.recommended}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* ESG Mode - Portfolio ESG Summary */}
        {showEsgMode && portfolioEsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-200">Portfolio ESG Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {portfolioEsg.portfolio_esg_score?.toFixed(1) || portfolioEsg.portfolioEsgScore?.toFixed(1) || 'N/A'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  (portfolioEsg.portfolio_esg_rating || portfolioEsg.portfolioEsgRating) === 'Leader'
                    ? 'bg-green-200 text-green-800'
                    : (portfolioEsg.portfolio_esg_rating || portfolioEsg.portfolioEsgRating) === 'Average'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {portfolioEsg.portfolio_esg_rating || portfolioEsg.portfolioEsgRating || 'N/A'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Environmental</div>
                <div className="font-bold text-green-600">
                  {portfolioEsg.portfolio_environmental_score?.toFixed(1) || portfolioEsg.portfolioEnvironmentalScore?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Social</div>
                <div className="font-bold text-blue-600">
                  {portfolioEsg.portfolio_social_score?.toFixed(1) || portfolioEsg.portfolioSocialScore?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Governance</div>
                <div className="font-bold text-purple-600">
                  {portfolioEsg.portfolio_governance_score?.toFixed(1) || portfolioEsg.portfolioGovernanceScore?.toFixed(1) || 'N/A'}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              ESG data coverage: {portfolioEsg.esg_coverage_pct?.toFixed(0) || portfolioEsg.esgCoveragePct?.toFixed(0) || 0}% of portfolio
            </div>
          </div>
        )}

        {/* ESG Mode - ESG Strategies */}
        {showEsgMode && esgStrategies?.available && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(esgStrategies)
              .filter(([key, data]) => key !== 'available' && key !== 'current_portfolio_esg' && key !== 'current_esg_rating' && data?.available !== false)
              .map(([key, data]) => {
                const config = esgStrategyConfig[key] || { label: key, icon: Leaf, color: 'green' };
                const Icon = config.icon;
                const colors = colorClasses[config.color] || colorClasses.green;
                const currentEsg = data.current_portfolio_esg || data.currentPortfolioEsg || portfolioEsg?.portfolio_esg_score || 0;
                const newEsg = data.new_portfolio_esg || data.newPortfolioEsg || currentEsg;
                const esgImprovement = data.esg_improvement || data.esgImprovement || (newEsg - currentEsg);

                return (
                  <div
                    key={key}
                    className={`relative p-4 rounded-xl border-2 ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${colors.badge}`}>
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <span className={`font-semibold text-sm ${colors.text}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Current ESG */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Current ESG</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {currentEsg?.toFixed(1) || 'N/A'}
                        </span>
                      </div>

                      {/* New ESG (if available) */}
                      {newEsg !== currentEsg && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">New ESG</span>
                          <span className="font-semibold text-green-600">
                            {newEsg?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      )}

                      {/* ESG Improvement */}
                      {esgImprovement > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Improvement</span>
                          <span className="font-semibold text-green-600">
                            +{esgImprovement?.toFixed(1)} pts
                          </span>
                        </div>
                      )}

                      {/* Positions Affected */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Trades</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {data.total_positions_to_adjust || data.totalPositionsToAdjust || data.recommendations?.length || 0} positions
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ESG Mode - Recommendations */}
        {showEsgMode && esgOptimization?.recommendations?.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-800 dark:text-amber-200">ESG Recommendations</span>
            </div>
            <ul className="space-y-2">
              {esgOptimization.recommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    rec.priority === 'HIGH' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {rec.priority}
                  </span>
                  <span>{rec.recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Standard Mode - Strategy Cards */}
        {!showEsgMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategyList.map((strategy) => {
            const Icon = strategy.config.icon;
            const colors = colorClasses[strategy.config.color] || colorClasses.blue;
            const expectedVol = (strategy.expectedPortfolioVolatility || 0) * 100;
            const volReduction = currentVolatility > 0
              ? ((currentVolatility - expectedVol) / currentVolatility * 100).toFixed(0)
              : 0;

            return (
              <button
                key={strategy.key}
                onClick={() => setSelectedStrategy(selectedStrategy === strategy.key ? null : strategy.key)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${colors.bg} ${
                  selectedStrategy === strategy.key
                    ? `${colors.border} ring-2 ring-offset-2`
                    : strategy.isRecommended
                    ? `${colors.border}`
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                {/* Recommended Badge */}
                {strategy.isRecommended && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow">
                    Recommended
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${colors.badge}`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <EducationalTooltip term={strategy.config.term} iconSize={12}>
                      <span className={`font-semibold text-sm ${colors.text}`}>
                        {strategy.config.label}
                      </span>
                    </EducationalTooltip>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Expected Volatility */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Expected Vol</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {expectedVol.toFixed(1)}%
                    </span>
                  </div>

                  {/* Volatility Reduction */}
                  {Number(volReduction) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Reduction</span>
                      <span className="font-semibold text-ios-green">
                        -{volReduction}%
                      </span>
                    </div>
                  )}

                  {/* Turnover */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Turnover</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {(strategy.costs.totalTurnoverPct || 0).toFixed(1)}%
                    </span>
                  </div>

                  {/* Positions Affected */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Trades</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {strategy.totalPositionsToAdjust || 0} positions
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          </div>
        )}

        {/* Selected Strategy Details - Standard Mode Only */}
        {!showEsgMode && selectedStrategy && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            {(() => {
              const strategy = strategyList.find(s => s.key === selectedStrategy);
              if (!strategy) return null;

              const colors = colorClasses[strategy.config.color] || colorClasses.blue;

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-semibold ${colors.text}`}>{strategy.config.label}</h4>
                    {strategy.isRecommended && (
                      <span className="text-xs text-amber-600 font-semibold">{recommended.reason}</span>
                    )}
                  </div>

                  {/* Weight Changes Preview */}
                  {strategy.weightChanges?.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Proposed Changes</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {strategy.weightChanges.slice(0, 6).map((change) => (
                          <div
                            key={change.ticker}
                            className={`p-2 rounded-lg text-xs ${
                              change.action === 'INCREASE' ? 'bg-green-50 dark:bg-green-900/20' :
                              change.action === 'DECREASE' ? 'bg-red-50 dark:bg-red-900/20' :
                              'bg-gray-100 dark:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{change.ticker}</span>
                              <span className={
                                change.action === 'INCREASE' ? 'text-green-600' :
                                change.action === 'DECREASE' ? 'text-red-600' :
                                'text-gray-500'
                              }>
                                {change.action}
                              </span>
                            </div>
                            <div className="text-gray-500 mt-1">
                              {change.currentWeight?.toFixed(1)}% → {change.optimalWeight?.toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cost Estimate */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Total Turnover</div>
                      <div className="font-bold">{(strategy.costs.totalTurnoverPct || 0).toFixed(1)}%</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Est. Cost</div>
                      <div className="font-bold">{formatCurrency(strategy.costs.estimatedCostDollars || 0, 2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Cost (bps)</div>
                      <div className="font-bold">{(strategy.costs.estimatedCostBps || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Analyst Tier - Benchmark Comparison (Standard Mode Only) */}
        {!showEsgMode && (viewTier === 'analyst' || viewTier === 'quant') && benchmarkComparison.benchmarkTicker && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Benchmark Comparison vs {benchmarkComparison.benchmarkTicker}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Strategy</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Est. Sharpe</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">vs Benchmark</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Volatility</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Tracking Error</th>
                  </tr>
                </thead>
                <tbody>
                  {strategyList.map((strategy) => (
                    <tr key={strategy.key} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="px-3 py-2">
                        <span className={`font-semibold ${strategy.isRecommended ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                          {strategy.config.shortLabel}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center font-mono">
                        {(strategy.benchmarkData.estimatedSharpe || 0).toFixed(3)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={strategy.benchmarkData.sharpeVsBenchmark > 0 ? 'text-green-600' : 'text-red-600'}>
                          {(strategy.benchmarkData.sharpeVsBenchmark || 0).toFixed(3)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center font-mono">
                        {formatPercent(strategy.benchmarkData.volatility || 0, 1)}
                      </td>
                      <td className="px-3 py-2 text-center font-mono">
                        {formatPercent(strategy.benchmarkData.trackingErrorEstimate || 0, 1)}
                      </td>
                    </tr>
                  ))}
                  {/* Benchmark Row */}
                  <tr className="bg-gray-50 dark:bg-gray-700/50 font-semibold">
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                      {benchmarkComparison.benchmarkTicker} (Benchmark)
                    </td>
                    <td className="px-3 py-2 text-center font-mono">
                      {(benchmarkComparison.benchmarkMetrics?.sharpeRatio || 0).toFixed(3)}
                    </td>
                    <td className="px-3 py-2 text-center">-</td>
                    <td className="px-3 py-2 text-center font-mono">
                      {formatPercent(benchmarkComparison.benchmarkMetrics?.volatility || 0, 1)}
                    </td>
                    <td className="px-3 py-2 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quant Tier - Full Strategy Metrics (Standard Mode Only) */}
        {!showEsgMode && viewTier === 'quant' && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? 'Hide' : 'Show'} Full Comparison Metrics
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                {/* Metrics Comparison */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-100 dark:bg-purple-900/30">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-purple-700 dark:text-purple-300">Metric</th>
                        {strategyList.map(s => (
                          <th key={s.key} className="px-3 py-2 text-center font-semibold text-purple-700 dark:text-purple-300">
                            {s.config.shortLabel}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">Expected Volatility</td>
                        {strategyList.map(s => (
                          <td key={s.key} className="px-3 py-2 text-center font-mono">
                            {((s.expectedPortfolioVolatility || 0) * 100).toFixed(2)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">Diversification Ratio</td>
                        {strategyList.map(s => (
                          <td key={s.key} className="px-3 py-2 text-center font-mono">
                            {(s.diversificationRatio || 0).toFixed(3)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">Positions to Adjust</td>
                        {strategyList.map(s => (
                          <td key={s.key} className="px-3 py-2 text-center font-mono">
                            {s.totalPositionsToAdjust || 0}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">Avg Weight Change</td>
                        {strategyList.map(s => {
                          const mc = comparison.metricsComparison?.[s.key];
                          return (
                            <td key={s.key} className="px-3 py-2 text-center font-mono">
                              {(mc?.averageWeightChange || 0).toFixed(2)}%
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">One-Sided Turnover</td>
                        {strategyList.map(s => (
                          <td key={s.key} className="px-3 py-2 text-center font-mono">
                            {(s.costs.oneSidedTurnoverPct || 0).toFixed(2)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">Est. Cost ($)</td>
                        {strategyList.map(s => (
                          <td key={s.key} className="px-3 py-2 text-center font-mono">
                            {formatCurrency(s.costs.estimatedCostDollars || 0, 2)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Benchmark Metrics */}
                {benchmarkComparison.benchmarkMetrics && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      {benchmarkComparison.benchmarkTicker} Benchmark Metrics
                    </h5>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">Expected Return</div>
                        <div className="font-bold">{formatPercent(benchmarkComparison.benchmarkMetrics.expectedReturn || 0, 1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Volatility</div>
                        <div className="font-bold">{formatPercent(benchmarkComparison.benchmarkMetrics.volatility || 0, 1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Sharpe Ratio</div>
                        <div className="font-bold">{(benchmarkComparison.benchmarkMetrics.sharpeRatio || 0).toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Portfolio Stats */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Current Portfolio</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Current Beta</div>
                      <div className="font-bold">{(benchmarkComparison.currentPortfolioBeta || 0).toFixed(3)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Current Sharpe</div>
                      <div className="font-bold">{(benchmarkComparison.currentPortfolioSharpe || 0).toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyComparisonCard;
