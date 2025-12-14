import { useState } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  PieChart,
  BarChart3,
} from 'lucide-react';

/**
 * PerformanceAttributionCard - Brinson Performance Attribution Analysis (Feature 9)
 * Shows allocation effect, selection effect, and sector-level attribution
 */
const PerformanceAttributionCard = ({
  performanceAttribution,
  viewTier = 'simple',
}) => {
  const [expanded, setExpanded] = useState(false);

  // Extract attribution data
  const summary = performanceAttribution?.attributionSummary || {};
  const sectorAttribution = performanceAttribution?.sectorAttribution || [];
  const status = performanceAttribution?.attributionStatus || 'not_available';

  // If no data, don't render
  if (!performanceAttribution || status !== 'complete') {
    return null;
  }

  const allocationEffect = summary.allocationEffectPct ?? 0;
  const selectionEffect = summary.selectionEffectPct ?? 0;
  const interactionEffect = summary.interactionEffectPct ?? 0;
  const totalActiveReturn = summary.totalActiveReturnPct ?? 0;
  const benchmarkTicker = performanceAttribution.benchmarkTicker || 'SPY';

  // Determine if active return is positive
  const isPositiveActive = totalActiveReturn >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isPositiveActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <Target className={`w-5 h-5 ${isPositiveActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Performance Attribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Brinson Model vs {benchmarkTicker}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isPositiveActive
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        }`}>
          {isPositiveActive ? '+' : ''}{totalActiveReturn.toFixed(2)}% Active
        </div>
      </div>

      <div className="p-5">
        {/* Attribution Summary */}
        <div className="grid grid-cols-3 gap-4">
          {/* Allocation Effect */}
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Allocation</span>
            </div>
            <div className={`text-2xl font-bold ${allocationEffect >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {allocationEffect >= 0 ? '+' : ''}{allocationEffect.toFixed(2)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sector weighting</p>
          </div>

          {/* Selection Effect */}
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Selection</span>
            </div>
            <div className={`text-2xl font-bold ${selectionEffect >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {selectionEffect >= 0 ? '+' : ''}{selectionEffect.toFixed(2)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock picking</p>
          </div>

          {/* Interaction Effect */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Interaction</span>
            </div>
            <div className={`text-2xl font-bold ${interactionEffect >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {interactionEffect >= 0 ? '+' : ''}{interactionEffect.toFixed(2)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Combined effect</p>
          </div>
        </div>

        {/* Analyst Tier - Interpretation */}
        {(viewTier === 'analyst' || viewTier === 'quant') && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Attribution Insights</h4>
            <div className="space-y-2 text-sm">
              {allocationEffect > 0.5 && (
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Strong sector allocation: Your sector weightings outperformed the benchmark by {allocationEffect.toFixed(2)}%
                  </span>
                </div>
              )}
              {allocationEffect < -0.5 && (
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Sector allocation drag: Consider rebalancing sector weights closer to benchmark
                  </span>
                </div>
              )}
              {selectionEffect > 0.5 && (
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Good stock selection: Your individual picks outperformed sector averages by {selectionEffect.toFixed(2)}%
                  </span>
                </div>
              )}
              {selectionEffect < -0.5 && (
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Stock selection drag: Individual holdings underperformed sector averages
                  </span>
                </div>
              )}
              {Math.abs(allocationEffect) <= 0.5 && Math.abs(selectionEffect) <= 0.5 && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Portfolio closely tracks benchmark performance across both allocation and selection
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quant Tier - Sector Attribution Breakdown */}
        {viewTier === 'quant' && sectorAttribution.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? 'Hide' : 'Show'} Sector Attribution Details
            </button>

            {expanded && (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span>Sector</span>
                  <span className="text-center">Portfolio %</span>
                  <span className="text-center">Benchmark %</span>
                  <span className="text-center">Allocation</span>
                  <span className="text-center">Selection</span>
                </div>
                {sectorAttribution.slice(0, 10).map((sector, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2 text-sm py-1.5 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{sector.sector}</span>
                    <span className="text-center">{(sector.portfolioWeightPct || 0).toFixed(1)}%</span>
                    <span className="text-center">{(sector.benchmarkWeightPct || 0).toFixed(1)}%</span>
                    <span className={`text-center font-semibold ${(sector.allocationEffectPct || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(sector.allocationEffectPct || 0) >= 0 ? '+' : ''}{(sector.allocationEffectPct || 0).toFixed(2)}%
                    </span>
                    <span className={`text-center font-semibold ${(sector.selectionEffectPct || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(sector.selectionEffectPct || 0) >= 0 ? '+' : ''}{(sector.selectionEffectPct || 0).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAttributionCard;
