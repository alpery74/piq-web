import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatPercent } from '@/utils/formatters';

/**
 * FundamentalsCard - Company fundamentals analysis
 * Shows P/E ratios, dividend yields, beta ranges, and quality metrics from backend
 */
const FundamentalsCard = ({
  riskDecomposition,
  qualityMetrics,
  viewTier = 'simple',
}) => {
  const [expanded, setExpanded] = useState(false);

  // Extract fundamentals data
  const fundamentals = riskDecomposition?.companyFundamentalsAnalysis || {};
  const valuation = fundamentals.valuationMetrics || {};
  const dividend = fundamentals.dividendAnalysis || {};
  const riskMetrics = fundamentals.riskMetrics || {};

  // FEATURE 10: Quality Metrics
  const profitability = qualityMetrics?.profitability || {};
  const financialHealth = qualityMetrics?.financialHealth || {};
  const qualityScore = qualityMetrics?.qualityScore ?? null;
  const qualityTier = qualityMetrics?.qualityTier ?? null;
  const hasQualityData = qualityMetrics && qualityScore !== null;

  // If no data at all, don't render
  if ((!fundamentals || Object.keys(fundamentals).length === 0) && !hasQualityData) {
    return null;
  }

  // Valuation data
  const avgPE = valuation.averagePeRatio || 0;
  const medianPE = valuation.medianPeRatio || 0;
  const peRange = valuation.peRatioRange || [0, 0];
  const expensivePositions = valuation.expensivePositions || [];
  const valuePositions = valuation.valuePositions || [];

  // Dividend data
  const weightedYield = dividend.portfolioWeightedDividendYield || 0;
  const dividendPayers = dividend.dividendPayingPositions || 0;
  const highDividend = dividend.highDividendPositions || [];
  const dividendCoverage = dividend.dividendCoverage || 0;

  // Risk metrics
  const weightedBeta = riskMetrics.portfolioWeightedBeta || 0;
  const highBetaPos = riskMetrics.highBetaPositions || [];
  const lowBetaPos = riskMetrics.lowBetaPositions || [];
  const betaRange = riskMetrics.betaRange || [0, 0];

  // Determine valuation status
  const valuationStatus = avgPE < 15 ? 'Value' : avgPE < 25 ? 'Fair' : 'Growth';
  const valuationColor = valuationStatus === 'Value' ? 'text-ios-green' : valuationStatus === 'Fair' ? 'text-ios-blue' : 'text-ios-purple';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Fundamentals</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Valuation & Income Analysis
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 ${valuationColor}`}>
          {valuationStatus} Tilt
        </div>
      </div>

      <div className="p-5">
        {/* Simple Tier - Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {/* P/E Ratio */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="peRatio" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg P/E Ratio</span>
            </EducationalTooltip>
            <div className={`text-2xl font-bold mt-1 ${valuationColor}`}>
              {avgPE > 0 ? avgPE.toFixed(1) : 'N/A'}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Median: {medianPE > 0 ? medianPE.toFixed(1) : 'N/A'}
            </div>
          </div>

          {/* Dividend Yield */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="dividendYield" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Dividend Yield</span>
            </EducationalTooltip>
            <div className={`text-2xl font-bold mt-1 ${weightedYield > 0.04 ? 'text-ios-green' : weightedYield > 0.02 ? 'text-ios-blue' : 'text-gray-600'}`}>
              {formatPercent(weightedYield, 2)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {dividendPayers} paying positions
            </div>
          </div>

          {/* Portfolio Beta */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <EducationalTooltip term="beta" iconSize={12}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Weighted Beta</span>
            </EducationalTooltip>
            <div className={`text-2xl font-bold mt-1 ${
              weightedBeta < 0.8 ? 'text-ios-green' :
              weightedBeta < 1.2 ? 'text-ios-blue' : 'text-ios-red'
            }`}>
              {weightedBeta.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Range: {betaRange[0]?.toFixed(2)} to {betaRange[1]?.toFixed(2)}
            </div>
          </div>
        </div>

        {/* FEATURE 10: Quality Metrics - ALL views */}
        {hasQualityData && (
          <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Quality Score</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                qualityTier === 'Excellent' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                qualityTier === 'Good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                qualityTier === 'Fair' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                <span className="text-2xl font-bold">{qualityScore?.toFixed(0)}</span>
                <span className="text-xs">/ 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* ROE */}
              <div className="p-2 bg-white/70 dark:bg-gray-800/50 rounded-lg text-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Return on Equity</span>
                <div className={`text-lg font-bold mt-0.5 ${
                  (profitability.returnOnEquityPct || 0) >= 15 ? 'text-ios-green' :
                  (profitability.returnOnEquityPct || 0) >= 10 ? 'text-ios-blue' : 'text-ios-orange'
                }`}>
                  {profitability.returnOnEquityPct !== undefined ? `${profitability.returnOnEquityPct.toFixed(1)}%` : 'N/A'}
                </div>
              </div>

              {/* Debt to Equity */}
              <div className="p-2 bg-white/70 dark:bg-gray-800/50 rounded-lg text-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Debt/Equity</span>
                <div className={`text-lg font-bold mt-0.5 ${
                  (financialHealth.debtToEquity || 0) <= 0.5 ? 'text-ios-green' :
                  (financialHealth.debtToEquity || 0) <= 1 ? 'text-ios-blue' :
                  (financialHealth.debtToEquity || 0) <= 2 ? 'text-ios-orange' : 'text-ios-red'
                }`}>
                  {financialHealth.debtToEquity !== undefined ? financialHealth.debtToEquity.toFixed(2) : 'N/A'}
                </div>
              </div>

              {/* Gross Margin */}
              <div className="p-2 bg-white/70 dark:bg-gray-800/50 rounded-lg text-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Gross Margin</span>
                <div className={`text-lg font-bold mt-0.5 ${
                  (profitability.grossMarginPct || 0) >= 40 ? 'text-ios-green' :
                  (profitability.grossMarginPct || 0) >= 25 ? 'text-ios-blue' : 'text-ios-orange'
                }`}>
                  {profitability.grossMarginPct !== undefined ? `${profitability.grossMarginPct.toFixed(1)}%` : 'N/A'}
                </div>
              </div>

              {/* Net Margin */}
              <div className="p-2 bg-white/70 dark:bg-gray-800/50 rounded-lg text-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Net Margin</span>
                <div className={`text-lg font-bold mt-0.5 ${
                  (profitability.netMarginPct || 0) >= 15 ? 'text-ios-green' :
                  (profitability.netMarginPct || 0) >= 8 ? 'text-ios-blue' :
                  (profitability.netMarginPct || 0) > 0 ? 'text-ios-orange' : 'text-ios-red'
                }`}>
                  {profitability.netMarginPct !== undefined ? `${profitability.netMarginPct.toFixed(1)}%` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Analyst+ View: Additional quality metrics */}
            {(viewTier === 'analyst' || viewTier === 'quant') && (
              <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Ratio:</span>
                    <span className={`font-semibold ${
                      (financialHealth.currentRatio || 0) >= 1.5 ? 'text-ios-green' :
                      (financialHealth.currentRatio || 0) >= 1 ? 'text-ios-orange' : 'text-ios-red'
                    }`}>
                      {financialHealth.currentRatio?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ROA:</span>
                    <span className="font-semibold">{profitability.returnOnAssetsPct?.toFixed(1) || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Operating Margin:</span>
                    <span className="font-semibold">{profitability.operatingMarginPct?.toFixed(1) || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quality Tier:</span>
                    <span className={`font-semibold ${
                      qualityTier === 'Excellent' ? 'text-ios-green' :
                      qualityTier === 'Good' ? 'text-ios-blue' :
                      qualityTier === 'Fair' ? 'text-ios-orange' : 'text-ios-red'
                    }`}>
                      {qualityTier || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quant View: Coverage info */}
            {viewTier === 'quant' && qualityMetrics?.coveragePct !== undefined && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Quality metrics based on {qualityMetrics.coveragePct?.toFixed(0)}% of portfolio holdings
              </div>
            )}
          </div>
        )}

        {/* Analyst Tier - Position Classifications */}
        {(viewTier === 'analyst' || viewTier === 'quant') && (
          <div className="mt-6 space-y-4">
            {/* Value vs Growth Positions */}
            <div className="grid grid-cols-2 gap-4">
              {/* Value Positions */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-300 text-sm">Value Positions</span>
                </div>
                {valuePositions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {valuePositions.map((ticker) => (
                      <span key={ticker} className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                        {ticker}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">None identified</span>
                )}
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">Lower P/E, potentially undervalued</p>
              </div>

              {/* Growth/Expensive Positions */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-800 dark:text-purple-300 text-sm">Growth Positions</span>
                </div>
                {expensivePositions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {expensivePositions.map((ticker) => (
                      <span key={ticker} className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
                        {ticker}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">None identified</span>
                )}
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Higher P/E, growth expectations</p>
              </div>
            </div>

            {/* Beta Classifications */}
            <div className="grid grid-cols-2 gap-4">
              {/* Low Beta */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Defensive (Low Beta)</span>
                </div>
                {lowBetaPos.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {lowBetaPos.map((ticker) => (
                      <span key={ticker} className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                        {ticker}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">None identified</span>
                )}
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Less sensitive to market moves</p>
              </div>

              {/* High Beta */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-red-800 dark:text-red-300 text-sm">Aggressive (High Beta)</span>
                </div>
                {highBetaPos.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {highBetaPos.map((ticker) => (
                      <span key={ticker} className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-xs font-medium">
                        {ticker}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">None identified</span>
                )}
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">Amplifies market movements</p>
              </div>
            </div>

            {/* High Dividend Positions */}
            {highDividend.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-amber-800 dark:text-amber-300 text-sm">High Dividend Payers</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {highDividend.map((ticker) => (
                    <span key={ticker} className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded text-xs font-medium">
                      {ticker}
                    </span>
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
              {expanded ? 'Hide' : 'Show'} Detailed Metrics
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                {/* P/E Range */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">P/E Ratio Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average P/E</span>
                      <span className="font-mono font-semibold">{avgPE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Median P/E</span>
                      <span className="font-mono font-semibold">{medianPE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">P/E Range</span>
                      <span className="font-mono font-semibold">{peRange[0]?.toFixed(2)} - {peRange[1]?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Dividend Details */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Dividend Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weighted Yield</span>
                      <span className="font-mono font-semibold">{formatPercent(weightedYield, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dividend Payers</span>
                      <span className="font-mono font-semibold">{dividendPayers} positions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Coverage</span>
                      <span className="font-mono font-semibold">{dividendCoverage.toFixed(1)}% of portfolio</span>
                    </div>
                  </div>
                </div>

                {/* Beta Details */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Beta Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Portfolio Weighted Beta</span>
                      <span className="font-mono font-semibold">{weightedBeta.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Beta Range</span>
                      <span className="font-mono font-semibold">{betaRange[0]?.toFixed(2)} to {betaRange[1]?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">High Beta Count</span>
                      <span className="font-mono font-semibold">{highBetaPos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Low Beta Count</span>
                      <span className="font-mono font-semibold">{lowBetaPos.length}</span>
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

export default FundamentalsCard;
