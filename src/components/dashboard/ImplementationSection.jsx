import { useState } from 'react';
import {
  Activity,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Percent,
  Layers,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import EducationalTooltip from '@/components/common/EducationalTooltip';
import { formatCurrency, formatPercent } from '@/utils/formatters';

/**
 * ImplementationSection - Shows liquidity, costs, tax efficiency, and execution planning
 * Uses data from optimization_implementation backend response
 */
const ImplementationSection = ({
  implementation,
  showAdvanced,
}) => {
  const [activeTab, setActiveTab] = useState('liquidity');

  if (!implementation || Object.keys(implementation).length === 0) {
    return null;
  }

  const {
    liquidity_analysis,
    transaction_cost_model,
    tax_efficiency_considerations,
    implementation_sequence,
    minimum_trade_thresholds,
  } = implementation;

  const tabs = [
    { id: 'liquidity', label: 'Liquidity', icon: Activity },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    { id: 'tax', label: 'Tax', icon: Percent },
    { id: 'execution', label: 'Execution', icon: Clock },
  ];

  return (
    <section className="rounded-2xl border border-purple-200 bg-purple-100/70 dark:bg-purple-900/20 dark:border-purple-800 p-4 sm:p-6 lg:p-8 shadow-md scroll-mt-44">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg text-purple-800 dark:text-purple-200">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 uppercase">Implementation View</p>
          <p className="text-sm text-purple-900 dark:text-purple-300">Smart execution for your portfolio changes.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/70 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Liquidity Tab */}
      {activeTab === 'liquidity' && liquidity_analysis && (
        <LiquidityPanel data={liquidity_analysis} showAdvanced={showAdvanced} />
      )}

      {/* Costs Tab */}
      {activeTab === 'costs' && transaction_cost_model && (
        <CostsPanel data={transaction_cost_model} showAdvanced={showAdvanced} />
      )}

      {/* Tax Tab */}
      {activeTab === 'tax' && tax_efficiency_considerations && (
        <TaxPanel data={tax_efficiency_considerations} showAdvanced={showAdvanced} />
      )}

      {/* Execution Tab */}
      {activeTab === 'execution' && implementation_sequence && (
        <ExecutionPanel data={implementation_sequence} thresholds={minimum_trade_thresholds} showAdvanced={showAdvanced} />
      )}
    </section>
  );
};

/**
 * Liquidity Panel - Position liquidity analysis
 */
const LiquidityPanel = ({ data, showAdvanced }) => {
  const { position_liquidity_scores, portfolio_weighted_liquidity, liquidity_level, illiquid_positions, liquidity_distribution } = data;

  const liquidityColor = {
    HIGH: 'text-ios-green',
    MEDIUM: 'text-ios-orange',
    LOW: 'text-ios-red',
  };

  const tierColors = {
    HIGHLY_LIQUID: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-300' },
    LIQUID: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-300' },
    MODERATELY_LIQUID: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300' },
    ILLIQUID: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-300' },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <EducationalTooltip term="liquidity" iconSize={14}>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Liquidity</span>
            </EducationalTooltip>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${liquidityColor[liquidity_level] || 'text-gray-900'}`}>
              {portfolio_weighted_liquidity?.toFixed(0) || 0}
            </span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <div className={`text-sm font-semibold mt-1 ${liquidityColor[liquidity_level]}`}>
            {liquidity_level}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Illiquid Positions</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {illiquid_positions?.length || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {illiquid_positions?.length > 0 ? 'Require careful execution' : 'All positions tradeable'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Cap Distribution</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Large/Mega Cap</span>
              <span className="font-semibold text-green-600">{liquidity_distribution?.mega_large_cap_pct?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Mid Cap</span>
              <span className="font-semibold text-blue-600">{liquidity_distribution?.mid_cap_pct?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Small/Micro</span>
              <span className="font-semibold text-orange-600">{liquidity_distribution?.small_micro_cap_pct?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Position Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white">Position Liquidity Scores</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Ticker</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Market Cap</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Tier</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Score</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Impact</th>
              </tr>
            </thead>
            <tbody>
              {position_liquidity_scores?.map((pos) => {
                const tierStyle = tierColors[pos.liquidity_tier] || tierColors.MODERATELY_LIQUID;
                return (
                  <tr key={pos.ticker} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900 dark:text-white">{pos.ticker}</span>
                      <div className="text-xs text-gray-500">{pos.sector}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatCurrency(pos.market_cap / 1e9, 1)}B
                      <div className="text-xs text-gray-500">{pos.market_cap_tier?.replace('_', ' ')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tierStyle.bg} ${tierStyle.text}`}>
                        {pos.liquidity_tier?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pos.liquidity_score >= 70 ? 'bg-green-500' :
                              pos.liquidity_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${pos.liquidity_score}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          {pos.liquidity_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${
                        pos.position_size_impact === 'HIGH' ? 'text-red-600' :
                        pos.position_size_impact === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {pos.position_size_impact}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Illiquid Warnings */}
      {illiquid_positions?.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-900 dark:text-red-200">Illiquid Position Alert</span>
          </div>
          <p className="text-sm text-red-800 dark:text-red-300 mb-2">
            The following positions may be difficult to trade without significant market impact:
          </p>
          <div className="flex flex-wrap gap-2">
            {illiquid_positions.map((pos) => (
              <span key={pos.ticker} className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold">
                {pos.ticker} ({formatCurrency(pos.market_cap / 1e6, 1)}M cap)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Costs Panel - Transaction cost estimates
 */
const CostsPanel = ({ data, showAdvanced }) => {
  const { portfolio_value_estimate, position_specific_costs, average_cost_bps, cost_optimization_opportunities } = data;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Portfolio Value</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(portfolio_value_estimate, 0)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <EducationalTooltip term="bidAskSpread" iconSize={14}>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Trading Cost</span>
            </EducationalTooltip>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {average_cost_bps?.toFixed(1)} <span className="text-lg font-normal">bps</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            ~{formatCurrency((portfolio_value_estimate * average_cost_bps) / 10000, 2)} per full turnover
          </div>
        </div>
      </div>

      {/* Position Costs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white">Trading Costs by Position</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Ticker</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Value</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Spread</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Impact</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {position_specific_costs?.map((pos) => (
                <tr key={pos.ticker} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{pos.ticker}</td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(pos.position_value, 0)}</td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{pos.bid_ask_spread_bps} bps</td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{pos.market_impact_bps} bps</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${pos.estimated_cost_per_trade_bps > 15 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                      {pos.estimated_cost_per_trade_bps} bps
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Tips */}
      {cost_optimization_opportunities?.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900 dark:text-blue-200">Cost Optimization Tips</span>
          </div>
          <ul className="space-y-2">
            {cost_optimization_opportunities.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Tax Panel - Tax efficiency analysis
 */
const TaxPanel = ({ data, showAdvanced }) => {
  const { tax_rate_assumptions, position_tax_analysis, tax_loss_harvesting_candidates, tax_efficiency_recommendations } = data;

  return (
    <div className="space-y-6">
      {/* Tax Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Long-Term Positions</div>
          <div className="text-3xl font-bold text-green-600">{tax_rate_assumptions?.long_term_positions || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Tax rate: ~{(tax_rate_assumptions?.estimated_long_term_rate * 100)?.toFixed(0)}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Short-Term Positions</div>
          <div className="text-3xl font-bold text-orange-600">{tax_rate_assumptions?.short_term_positions || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Tax rate: ~{(tax_rate_assumptions?.estimated_short_term_rate * 100)?.toFixed(0)}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <EducationalTooltip term="taxLossHarvesting" iconSize={14}>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Harvest Candidates</span>
            </EducationalTooltip>
          </div>
          <div className="text-3xl font-bold text-ios-blue">{tax_loss_harvesting_candidates?.length || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Positions with unrealized losses</div>
        </div>
      </div>

      {/* Tax-Loss Harvesting Candidates */}
      {tax_loss_harvesting_candidates?.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900 dark:text-green-200">Tax-Loss Harvesting Opportunities</span>
          </div>
          <div className="space-y-2">
            {tax_loss_harvesting_candidates.map((pos) => (
              <div key={pos.ticker} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{pos.ticker}</span>
                  <span className="text-sm text-gray-500 ml-2">({pos.current_weight?.toFixed(1)}% weight)</span>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-semibold">
                    {(pos.assumed_unrealized_gain_loss_pct * 100)?.toFixed(1)}% loss
                  </div>
                  <div className="text-xs text-gray-500">
                    Priority: {pos.tax_consideration_priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-green-700 dark:text-green-300">
            Consider selling these positions to realize losses that can offset capital gains elsewhere.
          </p>
        </div>
      )}

      {/* Position Tax Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white">Position Tax Analysis</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Ticker</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Weight</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Est. Gain/Loss</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Priority</th>
              </tr>
            </thead>
            <tbody>
              {position_tax_analysis?.map((pos) => (
                <tr key={pos.ticker} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{pos.ticker}</td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{pos.current_weight?.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={pos.tax_status === 'GAIN' ? 'text-green-600' : 'text-red-600'}>
                      {pos.tax_status === 'GAIN' ? '+' : ''}{(pos.assumed_unrealized_gain_loss_pct * 100)?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pos.tax_status === 'GAIN'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {pos.tax_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold ${
                      pos.tax_consideration_priority === 'HIGH' ? 'text-red-600' :
                      pos.tax_consideration_priority === 'MEDIUM' ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {pos.tax_consideration_priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {tax_efficiency_recommendations?.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 dark:text-amber-200">Tax Recommendations</span>
          </div>
          <ul className="space-y-2">
            {tax_efficiency_recommendations.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 italic">
            {data.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Execution Panel - Implementation sequence and phasing
 */
const ExecutionPanel = ({ data, thresholds, showAdvanced }) => {
  const { implementation_phases, phase_distribution, sequencing_rationale, recommended_approach } = data;

  const phaseColors = {
    phase_one_immediate: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-300' },
    phase_two_careful: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300' },
    phase_three_gradual: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-300' },
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <EducationalTooltip term="implementationPhase" iconSize={14}>
            <span className="font-semibold text-gray-900 dark:text-white">Implementation Strategy</span>
          </EducationalTooltip>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{recommended_approach}</p>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{phase_distribution?.immediate || 0}</div>
            <div className="text-xs text-gray-500">Immediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{phase_distribution?.careful || 0}</div>
            <div className="text-xs text-gray-500">3-7 Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{phase_distribution?.gradual || 0}</div>
            <div className="text-xs text-gray-500">1-2 Weeks</div>
          </div>
        </div>
      </div>

      {/* Phase Details */}
      {Object.entries(implementation_phases || {}).map(([phaseKey, phase]) => {
        const style = phaseColors[phaseKey] || phaseColors.phase_two_careful;
        return (
          <div key={phaseKey} className={`rounded-xl border ${style.border} overflow-hidden`}>
            <div className={`px-4 py-3 ${style.bg} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${style.text}`} />
                <span className={`font-semibold ${style.text}`}>
                  {phase.description}
                </span>
              </div>
              <span className={`text-sm ${style.text}`}>
                {phase.timeline} • {phase.positions?.length} positions
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4">
              <div className="flex flex-wrap gap-2">
                {phase.positions?.map((pos) => (
                  <div key={pos.ticker} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white">{pos.ticker}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pos.current_weight?.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                Total weight: {phase.total_weight?.toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })}

      {/* Minimum Trade Thresholds */}
      {showAdvanced && thresholds && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Trade Thresholds</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{thresholds.threshold_rationale}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {thresholds.position_thresholds?.map((t) => (
              <div key={t.ticker} className={`p-2 rounded-lg text-sm ${t.economically_viable ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <span className="font-semibold">{t.ticker}</span>
                <span className="text-gray-500 ml-1">min {formatCurrency(t.minimum_trade_threshold_dollars, 0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rationale */}
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <strong>Methodology:</strong> {sequencing_rationale}
      </div>
    </div>
  );
};

export default ImplementationSection;
