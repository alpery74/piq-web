import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatPercent, formatNumber, formatCurrency } from '@/utils/formatters';

/**
 * FundamentalsCard - Company fundamentals analysis
 * Shows P/E ratios, dividend yields, beta ranges from backend
 */
const FundamentalsCard = ({
  riskDecomposition,
  viewTier = 'simple',
}) => {
  const [expanded, setExpanded] = useState(false);

  // Extract fundamentals data
  const fundamentals = riskDecomposition?.companyFundamentalsAnalysis || {};
  const valuation = fundamentals.valuationMetrics || {};
  const dividend = fundamentals.dividendAnalysis || {};
  const riskMetrics = fundamentals.riskMetrics || {};

  // If no data, don't render
  if (!fundamentals || Object.keys(fundamentals).length === 0) {
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
