import { useState } from 'react';
import { Target, TrendingDown, Shield, PieChart, Plus, Check, X, BarChart3, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

// Goal type configurations
const GOAL_TYPES = {
  reduceVolatility: {
    icon: TrendingDown,
    label: 'Reduce Volatility',
    color: 'ios-blue',
    unit: '%',
    defaultTarget: 15,
    description: 'Lower portfolio risk by reducing overall volatility',
  },
  improveHealth: {
    icon: Shield,
    label: 'Improve Health Score',
    color: 'ios-green',
    unit: 'pts',
    defaultTarget: 80,
    description: 'Achieve a healthier, more balanced portfolio',
  },
  diversify: {
    icon: PieChart,
    label: 'Increase Diversification',
    color: 'ios-purple',
    unit: 'holdings',
    defaultTarget: 15,
    description: 'Spread risk across more asset classes',
  },
  reduceBeta: {
    icon: Target,
    label: 'Reduce Market Beta',
    color: 'ios-orange',
    unit: 'β',
    defaultTarget: 0.8,
    description: 'Lower correlation with market movements',
  },
};

// Progress bar with iOS styling
const ProgressBar = ({ current, target, color = 'ios-blue', showLabels = true }) => {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className="space-y-2">
      {showLabels && (
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Current: {current}</span>
          <span className="text-gray-500 dark:text-gray-400">Target: {target}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete ? 'bg-ios-green' : `bg-${color}`
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Single goal card
const GoalCard = ({ goal, onRemove, onEdit: _onEdit }) => {
  const config = GOAL_TYPES[goal.type];
  const Icon = config?.icon || Target;
  const progress = (goal.current / goal.target) * 100;
  const isComplete = goal.current >= goal.target;
  const remaining = goal.target - goal.current;

  return (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/10 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl bg-${config?.color || 'ios-blue'}/15`}
          >
            <Icon className={`w-5 h-5 text-${config?.color || 'ios-blue'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {goal.name || config?.label}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {config?.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(goal.id)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Remove goal"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <ProgressBar
        current={goal.current}
        target={goal.target}
        color={config?.color}
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="flex items-center gap-1 text-xs font-medium text-ios-green">
              <Check className="w-3.5 h-3.5" />
              Goal achieved!
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {remaining.toFixed(1)} {config?.unit} to go
            </span>
          )}
        </div>
        <span
          className={`text-sm font-bold ${
            isComplete ? 'text-ios-green' : `text-${config?.color || 'ios-blue'}`
          }`}
        >
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

// Add goal modal
const AddGoalModal = ({ isOpen, onClose, onAdd, currentMetrics }) => {
  const [selectedType, setSelectedType] = useState('reduceVolatility');
  const [targetValue, setTargetValue] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    const config = GOAL_TYPES[selectedType];
    onAdd({
      id: Date.now(),
      type: selectedType,
      name: config.label,
      current: currentMetrics[selectedType] || 0,
      target: parseFloat(targetValue) || config.defaultTarget,
      createdAt: new Date().toISOString(),
    });
    setTargetValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Set a New Goal
        </h3>

        {/* Goal type selection */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Goal Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(GOAL_TYPES).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = selectedType === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `border-${config.color} bg-${config.color}/10`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 text-${config.color}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target value input */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Value ({GOAL_TYPES[selectedType].unit})
          </label>
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder={GOAL_TYPES[selectedType].defaultTarget.toString()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-ios-blue focus:border-transparent outline-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Current: {currentMetrics[selectedType]?.toFixed(1) || 'N/A'} {GOAL_TYPES[selectedType].unit}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-3 rounded-xl bg-ios-blue text-white font-semibold hover:bg-ios-blue/90 transition-colors"
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  );
};

// TIER 2: Monte Carlo Projection Card (Feature #6)
const ProjectionCard = ({ projection, viewTier = 'simple' }) => {
  if (!projection) return null;

  const years = projection.years || 0;
  const medianValue = projection.medianProjectedValue || 0;
  const pessimistic = projection.pessimistic10pct || 0;
  const optimistic = projection.bullish90pct || 0;
  const expectedGrowth = projection.expectedGrowthPct || 0;

  return (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-ios-blue" />
        <span className="font-semibold text-gray-900 dark:text-white">{years}-Year Projection</span>
      </div>
      <div className="text-2xl font-bold text-ios-blue mb-1">
        {formatCurrency(medianValue, 0)}
      </div>
      <div className={`text-sm font-medium ${expectedGrowth >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
        {expectedGrowth >= 0 ? '+' : ''}{expectedGrowth.toFixed(1)}% expected
      </div>

      {/* Analyst+ view: Range */}
      {(viewTier === 'analyst' || viewTier === 'quant') && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Pessimistic (10%)</span>
            <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(pessimistic, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Optimistic (90%)</span>
            <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(optimistic, 0)}</span>
          </div>
        </div>
      )}

      {/* Quant view: Probability targets */}
      {viewTier === 'quant' && (
        <div className="mt-2 space-y-1 text-xs">
          {projection.probReach25pctGrowth !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">P(+25%)</span>
              <span className="font-mono">{projection.probReach25pctGrowth?.toFixed(0)}%</span>
            </div>
          )}
          {projection.probReach50pctGrowth !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">P(+50%)</span>
              <span className="font-mono">{projection.probReach50pctGrowth?.toFixed(0)}%</span>
            </div>
          )}
          {projection.probReach100pctGrowth !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">P(+100%)</span>
              <span className="font-mono">{projection.probReach100pctGrowth?.toFixed(0)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Goals Section
const GoalsSection = ({
  currentVolatility = 0,
  currentHealthScore = 0,
  currentHoldings = 0,
  currentBeta = 0,
  // TIER 2: Goal Projection props
  goalProjections = null,
  historicalAnnualReturnPct = null,
  historicalAnnualVolatilityPct = null,
  goalProjectionStatus = 'not_available',
  viewTier = 'simple',
}) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('portfolioGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TIER 2: Check if we have projection data
  const hasProjectionData = goalProjectionStatus === 'complete' && goalProjections;

  // Map current metrics to goal types
  const currentMetrics = {
    reduceVolatility: currentVolatility,
    improveHealth: currentHealthScore,
    diversify: currentHoldings,
    reduceBeta: currentBeta,
  };

  // Update localStorage when goals change
  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem('portfolioGoals', JSON.stringify(newGoals));
  };

  const addGoal = (goal) => {
    saveGoals([...goals, goal]);
  };

  const removeGoal = (id) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  // Update current values for existing goals
  const updatedGoals = goals.map((goal) => ({
    ...goal,
    current: currentMetrics[goal.type] || goal.current,
  }));

  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-ios-green/15 rounded-xl">
            <Target className="w-5 h-5 text-ios-green" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Portfolio Goals</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your progress toward financial targets
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ios-blue/10 hover:bg-ios-blue/20 text-ios-blue font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* TIER 2: Monte Carlo Projections (Feature #6) */}
      {hasProjectionData && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-ios-purple" />
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Monte Carlo Projections</h4>
            {(viewTier === 'analyst' || viewTier === 'quant') && historicalAnnualReturnPct !== null && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                Based on {historicalAnnualReturnPct?.toFixed(1)}% historical return, {historicalAnnualVolatilityPct?.toFixed(1)}% vol
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalProjections['1Year'] && (
              <ProjectionCard projection={goalProjections['1Year']} viewTier={viewTier} />
            )}
            {goalProjections['3Year'] && (
              <ProjectionCard projection={goalProjections['3Year']} viewTier={viewTier} />
            )}
            {goalProjections['5Year'] && (
              <ProjectionCard projection={goalProjections['5Year']} viewTier={viewTier} />
            )}
            {goalProjections['10Year'] && (
              <ProjectionCard projection={goalProjections['10Year']} viewTier={viewTier} />
            )}
          </div>
        </div>
      )}

      {updatedGoals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No goals set yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Add a goal to start tracking your portfolio progress
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {updatedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onRemove={removeGoal}
            />
          ))}
        </div>
      )}

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addGoal}
        currentMetrics={currentMetrics}
      />
    </div>
  );
};

export default GoalsSection;
