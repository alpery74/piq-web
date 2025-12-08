import { useState } from 'react';
import {
  Share2,
  ChevronDown,
  ChevronUp,
  Link2,
  Unlink,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import EducationalTooltip from '@/components/common/EducationalTooltip';

/**
 * CorrelationClustersCard - Visualize correlation clusters
 * Shows grouped tickers that move together
 */
const CorrelationClustersCard = ({
  riskDecomposition,
  viewTier = 'simple',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Extract clusters data
  const clusterData = riskDecomposition?.correlationClusters || {};
  const clusters = clusterData.correlationClusters || [];
  const totalClusters = clusterData.totalClusters || clusters.length;
  const recommendations = clusterData.diversificationRecommendations || [];
  const clustersAvailable = clusterData.clustersAvailable !== false;

  // Risk decomposition summary
  const summary = riskDecomposition?.riskDecompositionSummary || {};
  const diversificationEffectiveness = summary.diversificationEffectiveness || 0;
  const riskBalance = summary.riskBalanceAssessment || 'BALANCED';

  // If no clusters, don't render
  if (!clustersAvailable || clusters.length === 0) {
    return null;
  }

  // Cluster colors
  const clusterColors = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300' },
    { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-700', text: 'text-green-700 dark:text-green-300' },
    { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-300 dark:border-pink-700', text: 'text-pink-700 dark:text-pink-300' },
    { bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300' },
  ];

  // Count positions with diversification opportunity
  const diversifiedClusters = clusters.filter(c => c.diversificationOpportunity).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
            <Share2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Correlation Clusters</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {totalClusters} groups of related positions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            diversificationEffectiveness > 50
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : diversificationEffectiveness > 25
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {diversificationEffectiveness.toFixed(0)}% Diversified
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Simple Tier - Visual Clusters */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <EducationalTooltip term="correlationCluster" iconSize={14}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Stocks that move together
              </span>
            </EducationalTooltip>
          </div>

          {/* Cluster Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {clusters.map((cluster, idx) => {
              const colorScheme = clusterColors[idx % clusterColors.length];
              const isSelected = selectedCluster === cluster.clusterId;
              const hasMultiple = cluster.tickers?.length > 1;

              return (
                <button
                  key={cluster.clusterId}
                  onClick={() => setSelectedCluster(isSelected ? null : cluster.clusterId)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${colorScheme.bg} ${
                    isSelected ? `${colorScheme.border} ring-2 ring-offset-2` : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${colorScheme.text}`}>
                      Cluster {cluster.clusterId}
                    </span>
                    {hasMultiple ? (
                      <Link2 className={`w-4 h-4 ${colorScheme.text}`} />
                    ) : (
                      <Unlink className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Tickers */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {cluster.tickers?.map((ticker) => (
                      <span
                        key={ticker}
                        className={`px-2 py-0.5 rounded text-xs font-semibold bg-white dark:bg-gray-700 ${colorScheme.text}`}
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>

                  {/* Correlation */}
                  {hasMultiple && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Avg correlation: <span className="font-semibold">{(cluster.averageCorrelation || 0).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Diversification badge */}
                  {cluster.diversificationOpportunity && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Diversification opportunity</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Cluster Details */}
        {selectedCluster && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Cluster {selectedCluster} Details</span>
            </div>
            {(() => {
              const cluster = clusters.find(c => c.clusterId === selectedCluster);
              if (!cluster) return null;

              const hasMultiple = cluster.tickers?.length > 1;

              return (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {hasMultiple ? (
                    <>
                      <p>
                        These {cluster.tickers.length} positions (<strong>{cluster.tickers.join(', ')}</strong>) tend to move together
                        with an average correlation of <strong>{(cluster.averageCorrelation || 0).toFixed(2)}</strong>.
                      </p>
                      <p className="mt-2">
                        {cluster.averageCorrelation > 0.5
                          ? 'Consider this group as a single risk unit. Reducing one may not significantly diversify unless you add uncorrelated assets.'
                          : 'Moderate correlation - these provide some diversification benefit but still share some common movements.'}
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>{cluster.tickers?.[0]}</strong> is uncorrelated with other positions, providing independent risk exposure.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Analyst Tier - Risk Balance */}
        {(viewTier === 'analyst' || viewTier === 'quant') && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Risk Balance Assessment</h4>

            <div className={`p-4 rounded-xl border ${
              riskBalance === 'BALANCED'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : riskBalance === 'IDIOSYNCRATIC_HEAVY'
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {riskBalance === 'BALANCED' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                )}
                <span className={`font-semibold ${
                  riskBalance === 'BALANCED' ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'
                }`}>
                  {riskBalance === 'BALANCED' ? 'Well Balanced' :
                   riskBalance === 'IDIOSYNCRATIC_HEAVY' ? 'Stock-Specific Risk Heavy' :
                   'Systematic Risk Heavy'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {riskBalance === 'IDIOSYNCRATIC_HEAVY'
                  ? 'Your portfolio risk is dominated by individual stock movements rather than market movements. Consider adding broader market exposure.'
                  : riskBalance === 'SYSTEMATIC_HEAVY'
                  ? 'Your portfolio moves closely with the market. Consider adding uncorrelated positions for better diversification.'
                  : 'Good balance between market risk and stock-specific risk.'}
              </p>
            </div>

            {/* Key Insights */}
            {summary.keyInsights?.length > 0 && (
              <div className="mt-4">
                <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Key Insights</h5>
                <ul className="space-y-2">
                  {summary.keyInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
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
              {expanded ? 'Hide' : 'Show'} Cluster Statistics
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                {/* Detailed Cluster Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Cluster</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Tickers</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Avg Corr</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Diversification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clusters.map((cluster) => (
                        <tr key={cluster.clusterId} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                            #{cluster.clusterId}
                          </td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                            {cluster.tickers?.join(', ')}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`font-mono ${
                              cluster.averageCorrelation > 0.5 ? 'text-red-600' :
                              cluster.averageCorrelation > 0.3 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {(cluster.averageCorrelation || 0).toFixed(3)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {cluster.diversificationOpportunity ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Total Clusters</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{totalClusters}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Diversified Clusters</div>
                    <div className="text-xl font-bold text-green-600">{diversifiedClusters}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Systematic Risk</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {(summary.totalSystematicRisk || 0).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Idiosyncratic Risk</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {(summary.totalIdiosyncraticRisk || 0).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Diversification Recommendations</h5>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                      {recommendations.map((rec, idx) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
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

export default CorrelationClustersCard;
