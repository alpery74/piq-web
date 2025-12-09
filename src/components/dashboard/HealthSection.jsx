import { Activity, Shield, Target } from 'lucide-react';
import ExpandableSection from './ExpandableSection';
import InfoTooltip from './InfoTooltip';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatNumber, formatPercent } from '@/utils/formatters';

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

  return (
    <section
      className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-100/70 dark:bg-amber-900/20 p-4 sm:p-6 lg:p-8 shadow-md scroll-mt-44"
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
        <span className="px-3 py-1 rounded-full bg-white/70 border border-amber-200 text-amber-800 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="beta" iconSize={12}>
            <span>Beta:</span>
          </EducationalTooltip>
          {safePortfolioBeta.toFixed(2)}
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 border border-amber-200 text-amber-800 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="rSquared" iconSize={12}>
            <span>Explained:</span>
          </EducationalTooltip>
          {safeExplained.toFixed(1)}%
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 border border-amber-200 text-amber-800 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="idiosyncraticRisk" iconSize={12}>
            <span>Unexplained:</span>
          </EducationalTooltip>
          {safeUnexplained.toFixed(1)}%
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 border border-amber-200 text-amber-800 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="beta" iconSize={12}>
            <span>High β:</span>
          </EducationalTooltip>
          {safeHighest.ticker} ({(safeHighest.value || 0).toFixed(2)})
        </span>
        <span className="px-3 py-1 rounded-full bg-white/70 border border-amber-200 text-amber-800 font-semibold inline-flex items-center gap-1">
          <EducationalTooltip term="beta" iconSize={12}>
            <span>Low β:</span>
          </EducationalTooltip>
          {safeLowest.ticker} ({(safeLowest.value || 0).toFixed(2)})
        </span>
      </div>

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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Score Components</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <EducationalTooltip term="hhi" iconSize={14}>
                      <span>Concentration Risk</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-red-600">-{concentrationPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${concentrationPenalty}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <EducationalTooltip term="volatility" iconSize={14}>
                      <span>Volatility</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-orange-600">-{volatilityPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${volatilityPenalty}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <EducationalTooltip term="tailRisk" iconSize={14}>
                      <span>Tail Risk</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-orange-600">-{tailPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${tailPenalty}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <EducationalTooltip term="effectiveHoldings" iconSize={14}>
                      <span>Diversification</span>
                    </EducationalTooltip>
                  </span>
                  <span className="text-sm font-bold text-yellow-600">-{diversificationPenalty} points</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${diversificationPenalty * 2}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-2 bg-green-100 rounded">
                  <div className="font-bold text-green-800">Excellent</div>
                  <div className="text-green-600">80-100</div>
                </div>
                <div className="text-center p-2 bg-amber-100 rounded">
                  <div className="font-bold text-amber-800">Good</div>
                  <div className="text-amber-600">60-79</div>
                </div>
                <div className="text-center p-2 bg-orange-100 rounded">
                  <div className="font-bold text-orange-800">Fair</div>
                  <div className="text-orange-600">40-59</div>
                </div>
                <div className="text-center p-2 bg-red-100 rounded">
                  <div className="font-bold text-red-800">Poor</div>
                  <div className="text-red-600">0-39</div>
                </div>
              </div>
            </div>
          </div>
        }
        tier2={
          <div className="text-blue-900 space-y-4">
            <p className="leading-relaxed">
              Your health score evaluates four critical dimensions of portfolio construction. Think of it as a report card
              for your investments:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="font-bold mb-2">🎯 Concentration (-15)</div>
                <p className="text-sm">
                  Your largest position ({safeTopHolding.ticker}{' '}
                  {formatPercent((safeTopHolding.weightPct ?? 0) / 100, 1)}) exceeds the recommended 10-15%
                  maximum, creating unnecessary risk concentration.
                </p>
              </div>

              <div className="bg-white/50 p-4 rounded-lg">
                <div className="font-bold mb-2">📊 Volatility (-10)</div>
                <p className="text-sm">
                  Annual swings of {formatPercent(currentVol / 100, 1)}. Most balanced portfolios target 12-15% volatility.
                </p>
              </div>

              <div className="bg-white/50 p-4 rounded-lg">
                <div className="font-bold mb-2">⚠️ Tail Risk (-10)</div>
                <p className="text-sm">
                  In severe market crashes, crisis drawdown projects around{' '}
                  {formatPercent(analysis.stressTesting?.maxDrawdowns?.crisis ?? 0, 0)}, indicating high extreme-event
                  vulnerability.
                </p>
              </div>

              <div className="bg-white/50 p-4 rounded-lg">
                <div className="font-bold mb-2">🔀 Diversification (-5)</div>
                <p className="text-sm">
                  With {formatNumber(analysis.riskMetrics?.effectiveHoldings ?? 0, 1)} effective holdings, you're slightly
                  under-diversified. Target 10+ for optimal risk spreading.
                </p>
              </div>
            </div>

            <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg mt-4">
              <div className="font-bold mb-2">✅ Path to 85+ Score:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Reduce LW position from 23% to 10-12% (+10 points)</li>
                <li>Add 3-4 more positions for better diversification (+5 points)</li>
                <li>Implement optimization strategies below (+5-8 points)</li>
              </ul>
            </div>
          </div>
        }
        tier3={
          <div className="text-purple-900 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-base mb-3 border-b border-purple-300 pb-2">Calculation Formula</h4>
                <div className="font-mono text-sm space-y-2 bg-white/70 p-4 rounded">
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
                <h4 className="font-bold text-base mb-3 border-b border-purple-300 pb-2">Risk Adjustments</h4>
                <div className="bg-white/70 p-4 rounded space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Optimization Impact</span>
                    <span className="font-bold text-green-700">-25% σ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Diversification Benefit</span>
                    <span className="font-bold text-blue-700">
                      {((safeIdiosyncraticDetails.diversificationBenefit ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Systematic Risk</span>
                    <span className="font-bold text-gray-700">
                      {(safeRiskDecomposition.systematicRiskContributionPct ?? 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Idiosyncratic Risk</span>
                    <span className="font-bold text-gray-700">
                      {(safeRiskDecomposition.idiosyncraticRiskScorePct ?? 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-white/70 p-4 rounded space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Portfolio Volatility</span>
                    <span className="font-bold">{formatPercent(safeIdiosyncraticDetails.portfolioVolatility ?? 0, 2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weighted Indiv. Vol</span>
                    <span className="font-bold">
                      {formatPercent(safeIdiosyncraticDetails.weightedIndividualVolatility ?? 0, 2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 p-5 rounded-lg border-l-4 border-amber-400">
              <h4 className="font-bold mb-2 text-amber-900">Concentration Impact</h4>
              <p className="text-sm mb-2">
                Current weight: {safeConcentrationWeight.toFixed(1)}%. Each -1% reduction lowers risk contribution by{' '}
                {(safeTopRisk.contribution ?? 0) > 0 && safeConcentrationWeight > 0 ? ((safeTopRisk.contribution ?? 0) / safeConcentrationWeight).toFixed(2) : '0.00'} percentage points.
              </p>
              <div className="space-y-1 text-xs text-gray-700">
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
          <span className="text-3xl font-bold text-gray-900">{riskLevelLabel}</span>
          <span className="text-4xl">{riskEmoji}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{formatPercent(currentVol / 100, 1)} annual volatility</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div className="bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-full relative">
            <div className="absolute left-[53%] top-0 w-1 h-3 bg-white border-2 border-gray-800"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low (0-10%)</span>
          <span>High (&gt;25%)</span>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t-2 border-purple-200 space-y-2 bg-purple-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sharpe Ratio:</span>
              <span className="font-mono font-bold">{(safeVolatility.sharpe ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Beta:</span>
              <span className="font-mono font-bold">{safePortfolioBeta.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">95% VaR:</span>
              <span className="font-mono font-bold text-red-600">{(safeVolatility.var95DailyPct ?? 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CVaR:</span>
              <span className="font-mono font-bold text-red-600">{(safeVolatility.cvar95DailyPct ?? 0).toFixed(2)}%</span>
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
          <span className="text-4xl font-bold text-gray-900">{(safeRiskMetrics.effectiveHoldings ?? 0).toFixed(1)}</span>
          <span className="text-sm text-gray-600">effective holdings</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Target 10+ for stronger diversification.</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-red-500 via-amber-500 to-green-500 h-3 rounded-full relative"
            style={{ width: '100%' }}
          >
            <div
              className="absolute left-[20%] top-0 w-1 h-3 bg-gray-800"
              style={{ left: `${Math.min(100, (safeRiskMetrics.effectiveHoldings ?? 0) * 10)}%` }}
            >
              <div className="absolute -top-6 -left-1 text-xs font-bold text-gray-800 whitespace-nowrap">You</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>Concentrated (&lt;5)</span>
          <span>Optimal (10+)</span>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t-2 border-purple-200 space-y-2 bg-purple-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">HHI Score:</span>
              <span className="font-mono font-bold">{(safeRiskMetrics.alphaBookHHI ?? 0).toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gini Coefficient:</span>
              <span className="font-mono font-bold">{(safeRiskMetrics.gini ?? 0).toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sectors:</span>
              <span className="font-mono font-bold">
                {safeRiskMetrics.largestSector ?? 'N/A'} ({(safeRiskMetrics.largestSectorPct ?? 0).toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Concentration</p>
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
          <span className="text-4xl font-bold text-gray-900">{safeConcentrationWeight.toFixed(1)}%</span>
          <span className="text-sm text-gray-600">Top holding weight</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {safeTopHolding.ticker} drives {(safeTopRisk.contribution ?? 0).toFixed(1)}% of portfolio risk.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Recommended max</span>
            <span className="font-semibold">10-15%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-full relative">
              <div className="absolute right-[10%] top-0 w-1 h-3 bg-gray-800">
                <div className="absolute -top-6 right-0 text-xs font-bold text-gray-800 whitespace-nowrap">You →</div>
              </div>
              <div className="absolute left-[15%] top-0 w-1 h-3 bg-white">
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500 whitespace-nowrap">← Max</div>
              </div>
            </div>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t-2 border-purple-200 space-y-2 bg-purple-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Risk Contribution:</span>
              <span className="font-mono font-bold text-red-600">
                {(safeMarginalContributions
                  .find((m) => m.ticker === safeTopHolding.ticker)
                  ?.contribution ?? 0).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sector:</span>
              <span className="font-mono font-bold">Consumer Defensive</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Cap:</span>
              <span className="font-mono font-bold">$8.8B</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Volatility:</span>
              <span className="font-mono font-bold">46.1%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
  );
};

export default HealthSection;
