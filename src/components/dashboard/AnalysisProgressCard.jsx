import { CheckCircle2, Loader2, Clock, Activity, TrendingUp, PieChart, Shield, Target, Cog } from 'lucide-react';

// Map subtool names to display info
const SUBTOOL_CONFIG = {
  math_correlation: {
    label: 'Correlation Analysis',
    description: 'Beta, R², market correlations',
    icon: TrendingUp,
    section: 'overview',
  },
  math_risk_metrics: {
    label: 'Risk Metrics',
    description: 'HHI, effective holdings, concentration',
    icon: Activity,
    section: 'overview',
  },
  math_performance: {
    label: 'Performance',
    description: 'Portfolio value breakdown',
    icon: TrendingUp,
    section: 'overview',
  },
  math_volatility: {
    label: 'Volatility',
    description: 'VaR, CVaR, Sharpe ratio',
    icon: Shield,
    section: 'risk',
  },
  optimization_risk_decomposition: {
    label: 'Risk Decomposition',
    description: 'Position limits, contributions, clusters',
    icon: PieChart,
    section: 'holdings',
  },
  optimization_strategy_generation: {
    label: 'Strategy Generation',
    description: 'Min variance, risk parity options',
    icon: Target,
    section: 'optimization',
  },
  optimization_implementation: {
    label: 'Implementation',
    description: 'Liquidity, costs, execution',
    icon: Cog,
    section: 'implementation',
  },
  optimization_stress_testing: {
    label: 'Stress Testing',
    description: 'Monte Carlo, tail risk, drawdowns',
    icon: Shield,
    section: 'risk',
  },
};

const SUBTOOL_ORDER = [
  'math_correlation',
  'math_risk_metrics',
  'math_performance',
  'math_volatility',
  'optimization_risk_decomposition',
  'optimization_strategy_generation',
  'optimization_stress_testing',
  'optimization_implementation',
];

const AnalysisProgressCard = ({ pending, results, isConnected }) => {
  const completedCount = SUBTOOL_ORDER.filter(s => !pending.has(s)).length;
  const totalCount = SUBTOOL_ORDER.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="card-glass-blue overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ios-blue/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ios-blue/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-ios-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Analysis Progress</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {completedCount} of {totalCount} modules complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="progress-ios w-24">
              <div
                className="progress-ios-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-sm font-bold text-ios-blue">{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* Subtool List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {SUBTOOL_ORDER.map((subtool) => {
          const config = SUBTOOL_CONFIG[subtool];
          const Icon = config.icon;
          const isComplete = !pending.has(subtool);
          const hasResult = results[subtool] !== undefined;

          return (
            <div
              key={subtool}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                isComplete ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'
              }`}
            >
              {/* Status Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isComplete
                  ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isConnected ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium truncate ${
                    isComplete ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{config.description}</p>
              </div>

              {/* Status Badge */}
              <div className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                isComplete
                  ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300'
                  : 'bg-amber-100 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300'
              }`}>
                {isComplete ? 'Complete' : 'Running'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Results appear in sections as each module completes
        </p>
      </div>
    </div>
  );
};

export default AnalysisProgressCard;
