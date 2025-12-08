import { useState, useMemo } from 'react';
import {
  Beaker,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Simulated impact calculations
const calculateImpact = (holdings, changes, metrics) => {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  let newVolatility = metrics.volatility;
  let newBeta = metrics.beta;
  let newConcentration = metrics.concentration;
  let newRiskContribution = { ...metrics.riskContribution };

  // Apply changes
  Object.entries(changes).forEach(([ticker, changePercent]) => {
    const holding = holdings.find((h) => h.ticker === ticker);
    if (!holding) return;

    const currentWeight = holding.weight;
    const newWeight = Math.max(0, currentWeight + changePercent);
    const weightDelta = newWeight - currentWeight;

    // Simplified impact calculations (in real app, these would be from backend)
    const holdingRiskContrib = holding.riskContribution || currentWeight;

    // Volatility impact: reducing high-vol holdings reduces overall vol
    if (holding.volatility) {
      const volImpact = (holding.volatility / 100) * weightDelta * 0.3;
      newVolatility = Math.max(0, newVolatility + volImpact);
    }

    // Beta impact
    if (holding.beta) {
      const betaImpact = (holding.beta - 1) * (weightDelta / 100) * 0.5;
      newBeta = Math.max(0, newBeta + betaImpact);
    }

    // Risk contribution adjustment
    newRiskContribution[ticker] = Math.max(0, holdingRiskContrib + weightDelta * 0.8);

    // Concentration (HHI) adjustment
    const heldWeight = newWeight / 100;
    newConcentration = Math.max(0, newConcentration + (heldWeight * heldWeight - (currentWeight / 100) ** 2));
  });

  // Normalize risk contributions
  const totalRisk = Object.values(newRiskContribution).reduce((a, b) => a + b, 0);
  if (totalRisk > 0) {
    Object.keys(newRiskContribution).forEach((key) => {
      newRiskContribution[key] = (newRiskContribution[key] / totalRisk) * 100;
    });
  }

  return {
    volatility: newVolatility,
    beta: newBeta,
    concentration: newConcentration,
    riskContribution: newRiskContribution,
  };
};

// Change indicator component
const ChangeIndicator = ({ before, after, unit = '', inverse = false }) => {
  const change = after - before;
  const isPositive = inverse ? change < 0 : change > 0;
  const isNegative = inverse ? change > 0 : change < 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        {before.toFixed(2)}{unit}
      </span>
      <ArrowRight className="w-4 h-4 text-gray-400" />
      <span className={`font-semibold ${
        isPositive ? 'text-ios-green' : isNegative ? 'text-ios-red' : 'text-gray-900 dark:text-white'
      }`}>
        {after.toFixed(2)}{unit}
      </span>
      {change !== 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded ${
          isPositive ? 'bg-ios-green/15 text-ios-green' : 'bg-ios-red/15 text-ios-red'
        }`}>
          {change > 0 ? '+' : ''}{change.toFixed(2)}{unit}
        </span>
      )}
    </div>
  );
};

// Holding adjustment row
const HoldingRow = ({ holding, change, onChangeUpdate, totalValue }) => {
  const currentValue = holding.value;
  const newValue = currentValue * (1 + change / 100);
  const valueDelta = newValue - currentValue;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="w-16">
        <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
          {holding.ticker}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {holding.weight.toFixed(1)}%
          </span>
          {change !== 0 && (
            <>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className={`text-sm font-medium ${
                change > 0 ? 'text-ios-green' : 'text-ios-red'
              }`}>
                {(holding.weight + change).toFixed(1)}%
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangeUpdate(holding.ticker, Math.max(-holding.weight, change - 5))}
          className="p-1.5 rounded-lg bg-ios-red/10 text-ios-red hover:bg-ios-red/20 transition-colors"
          disabled={change <= -holding.weight}
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={change}
          onChange={(e) => onChangeUpdate(holding.ticker, parseFloat(e.target.value) || 0)}
          className="w-16 px-2 py-1 text-center text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          onClick={() => onChangeUpdate(holding.ticker, change + 5)}
          className="p-1.5 rounded-lg bg-ios-green/10 text-ios-green hover:bg-ios-green/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="w-24 text-right">
        <span className={`text-sm ${valueDelta >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
          {valueDelta >= 0 ? '+' : ''}{valueDelta.toFixed(0)}
        </span>
      </div>
    </div>
  );
};

// Main What-If Simulator component
const WhatIfSimulator = ({
  holdings = [],
  currentVolatility = 0,
  currentBeta = 0,
  currentConcentration = 0,
  isExpanded: initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [changes, setChanges] = useState({});

  // Calculate current metrics
  const currentMetrics = useMemo(() => ({
    volatility: currentVolatility,
    beta: currentBeta,
    concentration: currentConcentration,
    riskContribution: holdings.reduce((acc, h) => {
      acc[h.ticker] = h.riskContribution || h.weight;
      return acc;
    }, {}),
  }), [currentVolatility, currentBeta, currentConcentration, holdings]);

  // Calculate projected metrics based on changes
  const projectedMetrics = useMemo(() => {
    if (Object.keys(changes).length === 0) return currentMetrics;
    return calculateImpact(holdings, changes, currentMetrics);
  }, [holdings, changes, currentMetrics]);

  const hasChanges = Object.values(changes).some((c) => c !== 0);

  const updateChange = (ticker, value) => {
    setChanges((prev) => ({
      ...prev,
      [ticker]: value,
    }));
  };

  const resetChanges = () => {
    setChanges({});
  };

  // Summary of changes
  const changeSummary = useMemo(() => {
    const reductions = [];
    const increases = [];

    Object.entries(changes).forEach(([ticker, change]) => {
      if (change < 0) reductions.push({ ticker, change });
      if (change > 0) increases.push({ ticker, change });
    });

    return { reductions, increases };
  }, [changes]);

  if (holdings.length === 0) return null;

  return (
    <div id="whatif-section" className="card-glass">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-ios-orange/15 rounded-xl">
            <Beaker className="w-5 h-5 text-ios-orange" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">What-If Simulator</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See how changes would impact your portfolio
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="px-2 py-1 text-xs font-medium bg-ios-orange/15 text-ios-orange rounded-full">
              {Object.keys(changes).filter((k) => changes[k] !== 0).length} changes
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Impact preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Volatility</span>
              </div>
              <ChangeIndicator
                before={currentMetrics.volatility}
                after={projectedMetrics.volatility}
                unit="%"
                inverse
              />
            </div>

            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Beta</span>
              </div>
              <ChangeIndicator
                before={currentMetrics.beta}
                after={projectedMetrics.beta}
                unit=""
                inverse
              />
            </div>

            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Concentration</span>
              </div>
              <ChangeIndicator
                before={currentMetrics.concentration * 100}
                after={projectedMetrics.concentration * 100}
                unit="%"
                inverse
              />
            </div>
          </div>

          {/* Change summary */}
          {hasChanges && (
            <div className="flex flex-wrap gap-2 p-4 bg-ios-blue/5 dark:bg-ios-blue/10 rounded-xl border border-ios-blue/20">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary:</span>
              {changeSummary.reductions.map(({ ticker, change }) => (
                <span key={ticker} className="flex items-center gap-1 px-2 py-1 bg-ios-red/15 text-ios-red text-xs font-medium rounded-full">
                  <Minus className="w-3 h-3" />
                  {ticker} {change}%
                </span>
              ))}
              {changeSummary.increases.map(({ ticker, change }) => (
                <span key={ticker} className="flex items-center gap-1 px-2 py-1 bg-ios-green/15 text-ios-green text-xs font-medium rounded-full">
                  <Plus className="w-3 h-3" />
                  {ticker} +{change}%
                </span>
              ))}
            </div>
          )}

          {/* Holdings adjustment table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Adjust Holdings</h4>
              {hasChanges && (
                <button
                  onClick={resetChanges}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>

            <div className="bg-white/50 dark:bg-white/5 rounded-xl border border-white/30 dark:border-white/10 overflow-hidden">
              {/* Table header */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase">
                <div className="w-16">Ticker</div>
                <div className="flex-1">Weight</div>
                <div className="w-[140px] text-center">Adjustment (%)</div>
                <div className="w-24 text-right">Value Δ</div>
              </div>

              {/* Table rows */}
              <div className="px-4">
                {holdings.slice(0, 10).map((holding) => (
                  <HoldingRow
                    key={holding.ticker}
                    holding={holding}
                    change={changes[holding.ticker] || 0}
                    onChangeUpdate={updateChange}
                    totalValue={holdings.reduce((sum, h) => sum + h.value, 0)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              disabled={!hasChanges}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                hasChanges
                  ? 'bg-ios-blue text-white hover:bg-ios-blue/90'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Apply Changes
            </button>
            <button
              onClick={resetChanges}
              disabled={!hasChanges}
              className={`px-4 py-3 rounded-xl font-medium border transition-all ${
                hasChanges
                  ? 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-center text-gray-400">
            These are simulated projections. Actual results may vary based on market conditions.
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
