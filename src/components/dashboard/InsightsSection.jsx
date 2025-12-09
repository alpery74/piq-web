import { useMemo } from 'react';
import { AlertCircle, TrendingUp, Shield, PieChart } from 'lucide-react';
import ExpandableSection from './ExpandableSection';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatPercent } from '@/utils/formatters';

const InsightsSection = ({
  analysis,
  portfolioBeta,
  concentrationWeight,
  topRisk,
  optimizationReductionPct,
  currentVol,
  expectedMinVarVol,
  showOptimizationStrategies,
  setShowOptimizationStrategies,
  strategyLabels,
  explainedRiskPct,
  unexplainedRiskPct,
  correlationRows,
  showAdvanced,
  isExpanded,
  onToggle,
}) => {
  const correlationTableRows = useMemo(() => correlationRows, [correlationRows]);

  // Safe access to nested analysis properties
  const safeVolatility = analysis?.volatility || {};
  const safeRiskDecomposition = analysis?.riskDecomposition || {};
  const safeStrategies = analysis?.strategies || { expectedVol: {}, turnoverCosts: {}, recommended: '' };
  const safeCorrelation = analysis?.correlation || { tickers: [] };
  const safeTopHolding = analysis?.riskMetrics?.topHolding || { ticker: 'N/A', weightPct: 0 };
  const safeExpectedVol = safeStrategies.expectedVol || {};
  const safeTurnoverCosts = safeStrategies.turnoverCosts || {};
  const safeStressTesting = analysis?.stressTesting || {};
  const safeProbabilities = safeStressTesting.probabilities || {};
  const safeMaxDrawdowns = safeStressTesting.maxDrawdowns || {};
  const safeTailRisk = safeStressTesting.tail_risk_assessment || {};
  const safePositionLimits = safeRiskDecomposition.dynamicPositionLimits?.positionLimits || [];
  const recommendedLimit =
    safePositionLimits.find(
      (limit) => limit.ticker === safeTopHolding.ticker
    )?.recommendedMax ?? 16;
  const reductionNeeded = Math.max(0, (safeTopHolding.weightPct ?? 0) - recommendedLimit);

  return (
    <section
      className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-100/70 dark:bg-blue-900/20 p-4 sm:p-6 lg:p-8 shadow-md scroll-mt-44"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg text-blue-800 dark:text-blue-200">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase">Key Insights</p>
          <p className="text-sm text-blue-900 dark:text-blue-200">Actionable recommendations based on your portfolio analysis.</p>
        </div>
      </div>

      <ExpandableSection
        id="key-insights"
        title="Key Insights & Recommendations"
        icon={TrendingUp}
        isExpanded={isExpanded}
        onToggle={onToggle}
        showAdvanced={showAdvanced}
        tier1={
          <div className="grid grid-cols-1 gap-4">
            <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-xl group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      High Concentration Risk in {safeTopHolding.ticker}
                    </h3>
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">ACTION NEEDED</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {safeTopHolding.ticker} drives{' '}
                    <span className="font-bold text-red-700">{(topRisk?.contribution ?? 0).toFixed(1)}% of portfolio risk</span> while
                    being {(concentrationWeight ?? 0).toFixed(1)}% of holdings.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-white border border-red-300 rounded-full text-sm">
                      Current: {concentrationWeight.toFixed(1)}%
                    </span>
                    <span className="px-3 py-1 bg-green-100 border border-green-400 rounded-full text-sm font-semibold">
                      Target: up to {recommendedLimit.toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 text-sm">
                    <span className="font-semibold">💡 Recommended Action:</span> Adjust{' '}
                    {safeTopHolding.ticker} by{' '}
                    {reductionNeeded.toFixed(1)} percentage points to align with recommended limits.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Low Market Correlation</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">INFORMATIONAL</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Your portfolio has very low{' '}
                    <EducationalTooltip term="correlation" iconSize={14}>
                      <span className="font-medium underline decoration-dotted cursor-help">correlation</span>
                    </EducationalTooltip>{' '}
                    to the S&amp;P 500 (
                    <EducationalTooltip term="beta" iconSize={14}>
                      <span className="font-bold">β = {portfolioBeta.toFixed(2)}</span>
                    </EducationalTooltip>
                    ). This means your returns are driven by your stock picks, not market movements.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-800 mb-1">PRO</div>
                      <div className="text-sm text-green-900">Won't crash with market</div>
                    </div>
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <div className="text-xs font-semibold text-red-800 mb-1">CON</div>
                      <div className="text-sm text-red-900">Won't rally with market</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Optimization Opportunity</h3>
                    <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">OPPORTUNITY</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    You could reduce portfolio risk by up to{' '}
                    <span className="font-bold text-amber-700">{optimizationReductionPct}%</span> by following the{' '}
                    <EducationalTooltip term="minimumVariance" iconSize={14}>
                      <span className="font-medium underline decoration-dotted cursor-help">Minimum Variance</span>
                    </EducationalTooltip>{' '}
                    strategy while maintaining similar return potential.
                  </p>
                  <div className="bg-white/70 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <EducationalTooltip term="volatility" iconSize={14}>
                        <span className="text-sm font-medium">Current Volatility:</span>
                      </EducationalTooltip>
                      <span className="font-bold">{formatPercent(currentVol / 100, 1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">With Optimization:</span>
                      <span className="font-bold text-green-600">{expectedMinVarVol.toFixed(1)}%</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-300 space-y-3">
                      <button
                        onClick={() => setShowOptimizationStrategies((prev) => !prev)}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {showOptimizationStrategies ? 'Hide Optimization Strategies' : 'View Optimization Strategies →'}
                      </button>
                      {showOptimizationStrategies && (
                        <div className="space-y-3">
                          {Object.entries(safeExpectedVol).map(([key, vol]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between bg-white/80 border border-amber-200 rounded-lg p-3 shadow-sm"
                            >
                              <div>
                                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                  {strategyLabels[key] || key}
                                  {safeStrategies.recommended === key && (
                                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Turnover cost: {(safeTurnoverCosts[key] ?? 0).toFixed(2)}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">Est. volatility</div>
                                <div className="text-lg font-bold text-amber-700">{((vol ?? 0) * 100).toFixed(1)}%</div>
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            Strategies rearrange current holdings to lower risk. Focus on the recommended option first, then
                            consider the others if turnover costs fit your tolerance.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-base font-bold text-gray-900">Correlation Snapshot</h4>
                  <p className="text-xs text-gray-600">Benchmark: SPY · {safeCorrelation.tickers?.length ?? 0} assets analyzed</p>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold">β {portfolioBeta.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-xs text-gray-600">Weighted R²</div>
                  <div className="font-bold text-blue-900">{(safeCorrelation.portfolioRSquaredWeighted ?? 0).toFixed(3)}</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-xs text-gray-600">Explained Risk</div>
                  <div className="font-bold text-blue-900">{explainedRiskPct.toFixed(1)}%</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-xs text-gray-600">Unexplained Risk</div>
                  <div className="font-bold text-blue-900">{unexplainedRiskPct.toFixed(1)}%</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-xs text-gray-600">Assets Regressed</div>
                  <div className="font-bold text-blue-900">{safeCorrelation.tickers?.length ?? 0}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-base font-bold text-gray-900">Correlation Matrix (Preview)</h4>
                  <p className="text-xs text-gray-600">Hover to explore pairwise relationships</p>
                </div>
                <PieChart className="w-5 h-5 text-purple-700" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="p-2 border border-purple-200 font-mono">Ticker</th>
                      {(safeCorrelation.tickers || []).map((ticker) => (
                        <th key={ticker} className="p-2 border border-purple-200 font-mono">
                          {ticker}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {correlationTableRows.map((row) => (
                      <tr key={row.ticker} className="hover:bg-purple-50">
                        <td className="p-2 border border-purple-200 text-center font-bold bg-purple-50">{row.ticker}</td>
                        {row.values.map((cell, j) => (
                          <td
                            key={`${row.ticker}-${j}`}
                            className={`p-2 border border-purple-200 text-center ${
                              cell > 0.5
                                ? 'bg-red-100'
                                : cell > 0.3
                                ? 'bg-orange-100'
                                : cell < -0.3
                                ? 'bg-blue-100'
                                : 'bg-white'
                            }`}
                          >
                            {cell.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-xs text-purple-700 bg-purple-50 p-3 rounded">
                <strong>Color Guide:</strong>
                <span className="ml-2 inline-block w-4 h-4 bg-red-100 border border-red-300 rounded"></span> High correlation
                (&gt;0.5)
                <span className="ml-2 inline-block w-4 h-4 bg-orange-100 border border-orange-300 rounded"></span> Medium (0.3-0.5)
                <span className="ml-2 inline-block w-4 h-4 bg-blue-100 border border-blue-300 rounded"></span> Negative (&lt;-0.3)
              </div>
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-base font-bold text-gray-900">Risk Scenarios</h4>
                  <p className="text-xs text-gray-600">Monte Carlo + stress tests</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  safeTailRisk.tail_risk_level === 'HIGH'
                    ? 'bg-red-100 text-red-800'
                    : safeTailRisk.tail_risk_level === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  Tail risk: {safeTailRisk.tail_risk_level || 'Unknown'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-600">1-day VaR 95%</div>
                  <div className="font-bold text-amber-900">{(safeVolatility.var95DailyPct ?? 0).toFixed(2)}%</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-600">1-day CVaR 95%</div>
                  <div className="font-bold text-amber-900">{(safeVolatility.cvar95DailyPct ?? 0).toFixed(2)}%</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-600">Prob. of Loss</div>
                  <div className="font-bold text-amber-900">
                    {((safeProbabilities.loss ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-600">Prob. Large Loss</div>
                  <div className="font-bold text-amber-900">
                    {((safeProbabilities.bigLoss ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-600">Factor Shock</div>
                  <div className="font-bold text-amber-900">
                    {(safeStressTesting.factorShock ?? 0).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-600">Best / Worst Day</div>
                  <div className="font-bold text-amber-900">
                    {(safeVolatility.simulationBestDayPct ?? 0).toFixed(2)}% / {(safeVolatility.simulationWorstDayPct ?? 0).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-amber-100">
                  <div className="font-semibold text-gray-800 mb-1">Normal</div>
                  <div className="text-gray-700">Max drawdown: {((safeMaxDrawdowns.normal ?? 0) * 100).toFixed(1)}%</div>
                  <div className="text-gray-500">Prob: 70%</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-100">
                  <div className="font-semibold text-gray-800 mb-1">Stress</div>
                  <div className="text-gray-700">Max drawdown: {((safeMaxDrawdowns.stress ?? 0) * 100).toFixed(1)}%</div>
                  <div className="text-gray-500">Prob: 25%</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-100">
                  <div className="font-semibold text-gray-800 mb-1">Crisis</div>
                  <div className="text-gray-700">Max drawdown: {((safeMaxDrawdowns.crisis ?? 0) * 100).toFixed(1)}%</div>
                  <div className="text-gray-500">Prob: 5%</div>
                </div>
              </div>
            </div>
          </div>
        }
        tier2={
          <div className="space-y-4 text-blue-900">
            <p className="text-base leading-relaxed">
              These insights are ranked by priority and potential impact on your portfolio. Here's what each means for you:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 p-5 rounded-lg border-l-4 border-red-400">
                <h4 className="font-bold mb-2 text-red-900">🎯 Concentration Risk Details</h4>
                <p className="text-sm mb-3">
                  When one stock represents {concentrationWeight.toFixed(1)}% of your portfolio, a 20% drop in that stock causes a{' '}
                  {((concentrationWeight / 100) * 20).toFixed(1)}% portfolio loss. This is mathematical concentration risk.
                </p>
                <div className="text-xs bg-red-50 p-3 rounded border border-red-200">
                  <div>Reduce to &lt;15% and add 3-4 new positions to cut portfolio VaR by ~4-6%.</div>
                </div>
              </div>

              <div className="bg-white/60 p-5 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-bold mb-2 text-blue-900">🛡️ Low Beta Context</h4>
                <p className="text-sm mb-3">
                  β {portfolioBeta.toFixed(2)} means your returns are mostly idiosyncratic. That's great if you pick winners, but
                  it also means less uplift when markets rally.
                </p>
                <div className="text-xs bg-blue-50 p-3 rounded border border-blue-200">
                  <div>Consider blending a low-cost index ETF if you want more market participation.</div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 p-5 rounded-lg border-l-4 border-amber-400">
              <h4 className="font-bold mb-2 text-amber-900">⚙️ Optimization Details</h4>
              <p className="text-sm mb-3">
                The optimizer projects volatility improvement from {formatPercent(currentVol / 100, 1)} to{' '}
                {expectedMinVarVol.toFixed(1)}% in the minimum variance case, keeping weights similar to current holdings.
              </p>
              <div className="text-xs bg-amber-50 p-3 rounded border border-amber-200">
                <div>Focus on the recommended strategy first; others trade off turnover cost vs risk reduction.</div>
              </div>
            </div>
          </div>
        }
        tier3={
          <div className="space-y-4 text-purple-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 p-5 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-bold mb-2">Interpretation Framework</h4>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>Priority 1: Address concentration first to reduce tail risk and VaR.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Priority 2: Consider beta tilt depending on your view of the market.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Priority 3: Run optimizer for risk budget and turnover-friendly allocation.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 p-5 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-bold mb-2">Volatility Decomposition</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Systematic Risk Contribution</span>
                    <span className="font-bold">
                      {(safeRiskDecomposition.systematicRiskContributionPct ?? 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idiosyncratic Risk</span>
                    <span className="font-bold">{(safeRiskDecomposition.idiosyncraticRiskScorePct ?? 0).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Simulation Days</span>
                    <span className="font-bold">{safeVolatility.simulationDaysCount ?? safeVolatility.simulation_days_count ?? 0}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-purple-700 bg-purple-50 p-3 rounded">
                  <strong>Formula:</strong> σ²(portfolio) = β²σ²(market) + σ²(idiosyncratic) - Diversification Benefit
                </div>
              </div>
            </div>
          </div>
        }
      />
    </section>
  );
};

export default InsightsSection;
