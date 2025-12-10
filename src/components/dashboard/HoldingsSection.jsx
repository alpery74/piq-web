import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Layers, AlertCircle, Loader2 } from 'lucide-react';
import ExpandableSection from './ExpandableSection';
import { ActionBadge } from '@/components/common/Badge';
import { formatCurrency } from '@/utils/formatters';

// Empty state component for when data is not available
const EmptyDataState = ({ title, message, isLoading }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {isLoading ? (
      <>
        <Loader2 className="w-12 h-12 text-ios-blue animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">{title || 'Loading holdings data...'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {message || 'Waiting for risk decomposition analysis to complete'}
        </p>
      </>
    ) : (
      <>
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-gray-700 dark:text-gray-200 font-medium">{title || 'No holdings data available'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
          {message || 'Holdings will appear once the risk decomposition analysis completes. This analysis generates position limits and risk contributions for each ticker.'}
        </p>
      </>
    )}
  </div>
);

const HoldingsSection = ({
  analysis,
  portfolioData,
  pieColors,
  holdings,
  riskContributionData,
  showAdvanced,
  positionsOverLimit,
  concentrationWeight,
  topRisk,
  isExpanded,
  onToggle,
  isLoading = false,
}) => {
  // Check if we have valid data
  const hasHoldingsData = holdings && holdings.length > 0;
  const hasPortfolioData = portfolioData && portfolioData.length > 0;
  const hasRiskData = riskContributionData && riskContributionData.length > 0;
  return (
    <section
      className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 shadow-md scroll-mt-44"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Holdings</p>
          <p className="text-sm text-gray-800 dark:text-gray-200">Position weights, allocations, and risk contributions.</p>
        </div>
      </div>
      <ExpandableSection
        id="holdings"
        title="Portfolio Holdings"
        icon={Layers}
        isExpanded={isExpanded}
        onToggle={onToggle}
        showAdvanced={showAdvanced}
        tier1={
          <div>
            {!hasPortfolioData ? (
              <EmptyDataState
                isLoading={isLoading}
                title={isLoading ? 'Loading portfolio allocation...' : 'Portfolio allocation unavailable'}
                message={isLoading
                  ? 'The risk decomposition analysis is still running...'
                  : 'Position data will appear once the optimization_risk_decomposition subtool completes.'}
              />
            ) : (
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${(value ?? 0).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            )}

            {!hasHoldingsData ? (
              !hasPortfolioData ? null : (
                <EmptyDataState
                  isLoading={isLoading}
                  title={isLoading ? 'Loading holdings table...' : 'Holdings table unavailable'}
                  message="Individual position data will appear once analysis completes."
                />
              )
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="text-left">Ticker</th>
                      <th className="text-left">Name</th>
                      <th className="text-right">Weight</th>
                      <th className="text-right">Value</th>
                      <th className="text-right">Risk</th>
                      <th className="text-center">Action</th>
                      {showAdvanced && (
                        <>
                          <th className="text-right bg-purple-50">Volatility</th>
                          <th className="text-right bg-purple-50">Beta</th>
                          <th className="text-left bg-purple-50">Sector</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => (
                      <tr key={holding.ticker} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="font-mono font-bold text-base text-gray-900 dark:text-white">{holding.ticker}</td>
                        <td className="font-medium text-gray-800 dark:text-gray-200">{holding.name}</td>
                        <td className="text-right font-semibold">{(holding.weight ?? 0).toFixed(1)}%</td>
                        <td className="text-right">{formatCurrency(holding.value, 0)}</td>
                        <td
                          className={`text-right font-bold ${
                            (holding.riskContribution || 0) > 20
                              ? 'text-red-600 dark:text-red-400'
                              : (holding.riskContribution || 0) > 10
                              ? 'text-amber-600 dark:text-amber-400'
                              : (holding.riskContribution || 0) < 0
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {holding.riskContribution !== undefined ? `${(holding.riskContribution ?? 0).toFixed(1)}%` : '—'}
                        </td>
                        <td className="text-center">
                          <ActionBadge action={holding.action} size="sm" />
                        </td>
                        {showAdvanced && (
                          <>
                            <td className="text-right font-mono text-sm bg-purple-50">
                              {holding.volatility ? `${holding.volatility.toFixed(1)}%` : 'N/A'}
                            </td>
                            <td className="text-right font-mono text-sm bg-purple-50">
                              {holding.beta !== null ? holding.beta?.toFixed?.(2) || 'N/A' : 'N/A'}
                            </td>
                            <td className="text-sm bg-purple-50">{holding.sector}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        }
        tier2={
          <div className="space-y-4 text-blue-900 dark:text-blue-100">
            <p>Understanding your holdings at a deeper level:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">📊 Weight vs. Risk</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Notice how {analysis?.riskMetrics?.topHolding?.ticker ?? 'top holding'} is {(concentrationWeight ?? 0).toFixed(1)}% of your portfolio
                  but creates {(topRisk?.contribution ?? 0).toFixed(1)}% of risk. This disproportionate risk contribution signals
                  over-concentration.
                </p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">🎯 Action Recommendations</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Use the actions column as your quick to-do: reduce overweight positions, increase underweights, and hold
                  balanced positions.
                </p>
              </div>
            </div>
          </div>
        }
        tier3={
          <div className="space-y-6 text-purple-900 dark:text-purple-100">
            <div>
              <h4 className="font-bold text-base mb-3 text-gray-900 dark:text-white">Risk Contribution Analysis</h4>
              {!hasRiskData ? (
                <EmptyDataState
                  isLoading={isLoading}
                  title={isLoading ? 'Calculating risk contributions...' : 'Risk contribution data unavailable'}
                  message="Marginal risk contributions will appear once the optimization analysis completes."
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskContributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ticker" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="contribution" fill="#8B5CF6" name="Risk Contribution %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div>
              <h4 className="font-bold text-base mb-3 border-b border-purple-300 dark:border-purple-700 pb-2 text-gray-900 dark:text-white">Advanced Position Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded">
                  <div className="text-purple-600 dark:text-purple-400 font-semibold mb-1">TOTAL VALUE</div>
                  <div className="font-mono font-bold text-base text-gray-900 dark:text-white">$2,716</div>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded">
                  <div className="text-purple-600 dark:text-purple-400 font-semibold mb-1">ALPHA BOOK</div>
                  <div className="font-mono font-bold text-base text-gray-900 dark:text-white">91.2%</div>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded">
                  <div className="text-purple-600 dark:text-purple-400 font-semibold mb-1">BETA BOOK</div>
                  <div className="font-mono font-bold text-base text-gray-900 dark:text-white">8.8%</div>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded">
                  <div className="text-purple-600 dark:text-purple-400 font-semibold mb-1">LARGEST SECTOR</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">Real Estate</div>
                  <div className="text-gray-600 dark:text-gray-400">34.7%</div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="mt-6 card border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Implementation & Trading</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Practical steps to execute changes</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {positionsOverLimit.length} positions over limits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Position Limits Check</div>
            <ul className="space-y-2">
              {positionsOverLimit.slice(0, 5).map((p) => {
                const currentWt = p.currentWeight ?? p.currentWeightPct ?? p.weight ?? 0;
                const maxWt = p.recommendedMax ?? p.recommendedMaxPct ?? p.maxWeight ?? 0;
                return (
                  <li key={p.ticker || 'unknown'} className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{p.ticker || '—'}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {currentWt.toFixed(1)}% → Max {maxWt.toFixed(1)}%
                    </span>
                  </li>
                );
              })}
              {positionsOverLimit.length > 5 && (
                <li className="text-xs text-gray-500 dark:text-gray-400">+{positionsOverLimit.length - 5} more over limits</li>
              )}
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Strategy Pick</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Recommended: <span className="font-bold text-gray-900 dark:text-white">Minimum Variance</span> (lower expected volatility).
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Sequence trades from most liquid to least to manage costs. Use turnover estimates from the optimization section to
              plan blocks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HoldingsSection;
